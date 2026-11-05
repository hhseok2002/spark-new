import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";

/* 1. Firebase 프로젝트 설정 */
const firebaseConfig = {
  apiKey: "AIzaSyB5fGFCxnzTb7NvRKGg1skEI67vrdA1vFY",
  authDomain: "spark-6c6ca.firebaseapp.com",
  projectId: "spark-6c6ca",
  storageBucket: "spark-6c6ca.firebasestorage.app",
  messagingSenderId: "379358194117",
  appId: "1:379358194117:web:3685923f9301509976c3ac",
  measurementId: "G-JD3WLKET7K"
};

/*
  2. Firebase Authentication에서 만든
     관리자 계정의 UID로 변경

  비밀번호는 절대 이 코드에 입력하지 마세요.
*/
const ADMIN_UIDS = [
    "3jpQX4wHk5eZxrRVc3rvctolqHo2",
    "3Gcidpsv5uVJTWnRFEMmnk7WEbu2",
    "I35Ox3ExDShrs1fsDAzqjY9ib732",
    "bv7XlGXs5bRsUEMFekLcYcldRQ63",
    "qyKZU4UMXzOaGWDX3AAasZDOejX2",
    "FFpv7LW6mAUUzMWgtgL4yn4et1L2",
    "nSCnr37QXITekybnixYLWVcpLIu2",
    "OpcTniweqbZ6eaXD1DPErBG4KcK2",
    "AhEOeXMvoVeTroYZiQmk7ADZcA63",
    "9Ux62cv8VTX1aPT6ZeoTeS037bJ2"
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "default");
const storage = getStorage(app);

/* 3. HTML 요소 */
const loginBtn = document.getElementById("loginBtn");
const writeBtn = document.getElementById("writeBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginModal = document.getElementById("loginModal");
const writeModal = document.getElementById("writeModal");

const loginForm = document.getElementById("loginForm");
const postForm = document.getElementById("postForm");

const loginStatus = document.getElementById("loginStatus");
const formStatus = document.getElementById("formStatus");
const listStatus = document.getElementById("listStatus");

const loginSubmit = document.getElementById("loginSubmit");
const submitPost = document.getElementById("submitPost");

const imageInput = document.getElementById("postImage");
const imagePreview = document.getElementById("imagePreview");
const textInput = document.getElementById("postText");

const postList = document.getElementById("postList");
const emptyMessage = document.getElementById("emptyMessage");

async function compressImage(file) {
  const bitmap = await createImageBitmap(file);

  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / bitmap.width);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      result => result ? resolve(result) : reject(
        new Error("이미지 압축 실패")
      ),
      "image/webp",
      0.8
    );
  });

  
  return blob.size < file.size ? blob : file;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

let currentAdmin = null;
let previewUrl = null;

/* 4. 관리자 확인 */
function isAdmin(user) {
    return Boolean(user && ADMIN_UIDS.includes(user.uid));
}

function updateAdminUI() {
  const admin = isAdmin(auth.currentUser);

  loginBtn.hidden = admin;
  writeBtn.hidden = !admin;
  logoutBtn.hidden = !admin;

  if (!admin) {
    writeModal.hidden = true;
  }
}

/* 5. 로그인 상태 확인 */
onAuthStateChanged(auth, user => {
  currentAdmin = isAdmin(user) ? user : null;
  updateAdminUI();
  loadPosts();
});

/* 6. 로그인 팝업 */
loginBtn.addEventListener("click", () => {
  loginStatus.textContent = "";
  loginModal.hidden = false;
});

document.getElementById("closeLogin")
  .addEventListener("click", () => {
    loginModal.hidden = true;
  });

/* 7. 관리자 로그인 */
loginForm.addEventListener("submit", async event => {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  loginSubmit.disabled = true;
  loginStatus.textContent = "로그인 중입니다...";

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!isAdmin(result.user)) {
      await signOut(auth);
      throw new Error("관리자 권한이 없는 계정입니다.");
    }

    loginForm.reset();
    loginStatus.textContent = "";
    loginModal.hidden = true;
  } catch (error) {
    console.error(error);
    loginStatus.textContent =
      "로그인에 실패했습니다. 계정과 관리자 권한을 확인해주세요.";
  } finally {
    loginSubmit.disabled = false;
  }
});

/* 8. 로그아웃 */
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    alert("로그아웃에 실패했습니다.");
  }
});

/* 9. 작성 팝업 */
writeBtn.addEventListener("click", () => {
  if (!currentAdmin) return;

  formStatus.textContent = "";
  writeModal.hidden = false;
});

document.getElementById("closeWrite")
  .addEventListener("click", () => {
    writeModal.hidden = true;
  });

[loginModal, writeModal].forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.hidden = true;
    }
  });
});

/* 10. 이미지 미리보기 */
imageInput.addEventListener("change", () => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  const file = imageInput.files[0];

  if (!file) {
    imagePreview.hidden = true;
    return;
  }

  if (
    !ALLOWED_TYPES.includes(file.type) ||
    file.size > MAX_FILE_SIZE
  ) {
    alert("5MB 이하의 JPG, PNG, WebP만 업로드할 수 있습니다.");
    imageInput.value = "";
    imagePreview.hidden = true;
    return;
  }

  previewUrl = URL.createObjectURL(file);
  imagePreview.src = previewUrl;
  imagePreview.hidden = false;
});

/* 11. 게시물 블록 생성 */
function makePostBlock(post, postId) {
  const block = document.createElement("article");
  block.className = "post-block";

  // 이미지
  const imageBox = document.createElement("div");
  imageBox.className = "post-image";

  const image = document.createElement("img");
  image.src = post.imageUrl;
  image.alt = "SPARK 전시 기록";
  image.loading = "lazy";

  imageBox.appendChild(image);

  // 글 영역
  const info = document.createElement("div");
  info.className = "post-info";

  const meta = document.createElement("div");
  meta.className = "post-meta";

  const title = document.createElement("h3");
  title.textContent = "SPARK ARCHIVE";

  const date = document.createElement("time");

  if (post.createdAt) {
    const value = post.createdAt.toDate();
    date.dateTime = value.toISOString();
    date.textContent = value.toLocaleDateString("ko-KR");
  }

  meta.append(title, date);

  const content = document.createElement("p");
  content.className = "post-content";
  content.textContent = post.text;

  info.append(meta, content);

  // 관리자에게만 삭제 버튼 표시
  if (currentAdmin) {
    const controls = document.createElement("div");
    controls.className = "post-controls";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "게시물 삭제";

    deleteBtn.addEventListener("click", () => {
      deletePost(postId, post.imagePath);
    });

    controls.appendChild(deleteBtn);
    info.appendChild(controls);
  }

  block.append(imageBox, info);

  return block;
}

/* 12. 게시물 목록 불러오기 */
const postsQuery = query(
  collection(db, "moments"),
  orderBy("createdAt", "desc"),
  limit(60)
);

let unsubscribePosts = null;

function loadPosts() {
  if (unsubscribePosts) {
    unsubscribePosts();
  }

  unsubscribePosts = onSnapshot(
    postsQuery,
    snapshot => {
      postList.replaceChildren();

      snapshot.forEach(postDoc => {
        const post = postDoc.data();

        postList.appendChild(
          makePostBlock(post, postDoc.id)
        );
      });

      emptyMessage.hidden = !snapshot.empty;
      listStatus.textContent = "";
    },
    error => {
      console.error(error);
      listStatus.textContent =
        "게시물을 불러오지 못했습니다.";
    }
  );
}

/* 13. 관리자 게시물 등록 */
postForm.addEventListener("submit", async event => {
  event.preventDefault();

  if (!currentAdmin) {
    formStatus.textContent = "관리자 로그인이 필요합니다.";
    return;
  }

  const file = imageInput.files[0];
  const text = textInput.value.trim();

  if (!file || !text || text.length > 1000) {
    formStatus.textContent = "이미지와 내용을 확인해주세요.";
    return;
  }

  if (
    !ALLOWED_TYPES.includes(file.type) ||
    file.size > MAX_FILE_SIZE
  ) {
    formStatus.textContent =
      "5MB 이하의 JPG, PNG, WebP만 등록할 수 있습니다.";
    return;
  }

  submitPost.disabled = true;

  let uploadedImageRef = null;
  let uploadCompleted = false;
  let postSaved = false;

  try {
    // 1. 이미지 압축
    formStatus.textContent = "이미지를 압축하고 있습니다...";

    const optimizedFile = await compressImage(file);

    console.log("압축 완료:", optimizedFile.size, "bytes");

    // 2. 파일 경로 생성
    const extension =
      optimizedFile.type === "image/webp" ? "webp" :
      optimizedFile.type === "image/png" ? "png" : "jpg";

    const fileName = crypto.randomUUID() + "." + extension;
    const imagePath = `moments/${fileName}`;

    uploadedImageRef = ref(storage, imagePath);

    // 3. 이미지 업로드
    formStatus.textContent = "이미지를 업로드하고 있습니다...";

    await uploadBytes(uploadedImageRef, optimizedFile, {
      contentType: optimizedFile.type
    });

    uploadCompleted = true;
    console.log("Storage 업로드 완료");

    // 4. 이미지 URL 가져오기
    formStatus.textContent = "이미지 주소를 가져오는 중입니다...";

    const imageUrl = await getDownloadURL(uploadedImageRef);

    console.log("이미지 URL 가져오기 완료");

    // 5. Firestore 저장
    formStatus.textContent = "게시물 정보를 저장하고 있습니다...";

    const savedPost = await addDoc(
      collection(db, "moments"),
      {
        text,
        imageUrl,
        imagePath,
        authorId: currentAdmin.uid,
        createdAt: serverTimestamp()
      }
    );

    postSaved = true;
    console.log("Firestore 저장 완료:", savedPost.id);

    // 6. 저장 성공 후 초기화
    postForm.reset();
    imagePreview.hidden = true;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }

    formStatus.textContent = "";
    writeModal.hidden = true;

  } catch (error) {
    console.error("게시물 등록 오류:", error);

    formStatus.textContent =
      "등록 실패: " + (error.code || error.message);

    // 업로드는 완료됐지만 게시물 저장이 실패한 경우 정리
    if (uploadCompleted && !postSaved && uploadedImageRef) {
      try {
        await deleteObject(uploadedImageRef);
        console.log("미등록 이미지 정리 완료");
      } catch (cleanupError) {
        console.warn("이미지 정리 실패:", cleanupError);
      }
    }

  } finally {
    submitPost.disabled = false;
  }
});

/* 14. 관리자 게시물 삭제 */
async function deletePost(postId, imagePath) {
  if (!currentAdmin) return;

  const confirmed = confirm("이 게시물을 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    // 데이터베이스에서 게시물 삭제
    await deleteDoc(doc(db, "moments", postId));

    // 이미지 파일도 삭제
    if (imagePath) {
      try {
        await deleteObject(ref(storage, imagePath));
      } catch (imageError) {
        console.warn("이미지 파일 삭제 실패:", imageError);
        alert("게시물은 삭제됐지만 이미지 파일 정리가 필요합니다.");
      }
    }
  } catch (error) {
    console.error(error);
    alert("게시물 삭제에 실패했습니다.");
  }
}