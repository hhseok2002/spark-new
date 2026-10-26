const tabButtons = document.querySelectorAll(".credits-btn");
const tabContents = document.querySelectorAll(".credits-content");

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        /* 모든 버튼에서 active 제거 */
        tabButtons.forEach((btn) => {
            btn.classList.remove("active");
        });
        /* 모든 콘텐츠 숨기기 */
        tabContents.forEach((content) => {
            content.classList.remove("active");
        });
        /* 클릭한 버튼 활성화 */
        button.classList.add("active");
        /* 클릭한 버튼의 data-tab 가져오기 */
        const target = button.dataset.tab;
        /* 해당 콘텐츠 표시 */
        document
            .getElementById(target)
            .classList.add("active");
    });
});