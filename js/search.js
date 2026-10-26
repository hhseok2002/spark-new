const searchInput = document.getElementById("searchInput");
const items = document.querySelectorAll(".work-item");

searchInput.addEventListener("input", function() {
    // 검색창에 입력한 글자
    const keyword = searchInput.value
        .toLowerCase()
        .trim();
    // 모든 이미지 확인
    items.forEach(function (item) {
        // HTML의 data-name 가져오기
        const name = item.dataset.name
            .toLowerCase();
        // 검색어가 포함되어 있는지 확인
        if (name.includes(keyword)) {
            //일치하면 이미지 표시
            item.style.display = "block";
        } else {
            // 일치하지 않으면 숨기기
            item.style.display = "none";
        }
    });
});