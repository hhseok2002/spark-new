document.addEventListener("DOMContentLoaded", () => {

    const logoButton =
        document.getElementById("logoButton");

    const clickGuide =
        document.getElementById("clickGuide");

    const effectContainer =
        document.getElementById("effectContainer");


    /* ================================
       필수 요소 확인
    ================================ */

    if (!logoButton || !effectContainer) {

        console.error(
            "인트로 요소를 찾을 수 없습니다."
        );

        return;
    }


    let isMoving = false;



    /* ================================
       로고 클릭
    ================================ */

    logoButton.addEventListener("click", () => {

        /* 중복 클릭 방지 */

        if (isMoving) {
            return;
        }

        isMoving = true;



        /* ================================
           메인 페이지 이동

           효과에서 오류가 발생해도
           main.html로 이동할 수 있도록
           가장 먼저 실행 예약
        ================================ */

        window.setTimeout(() => {

            window.location.assign(
                "./main.html"
            );

        }, 1800);



        /* 로고 클릭 애니메이션 */

        logoButton.classList.add(
            "is-clicked"
        );



        /* CLICK TO ENTER 숨기기 */

        if (clickGuide) {

            clickGuide.classList.add(
                "is-hidden"
            );

        }



        /* ================================
           로고 중앙 위치 계산
        ================================ */

        const rect =
            logoButton.getBoundingClientRect();


        const centerX =
            rect.left +
            rect.width / 2;


        const centerY =
            rect.top +
            rect.height / 2;



        /* ================================
           효과 실행
        ================================ */

        try {

            createFlash(
                centerX,
                centerY
            );


            createPosterParticles(
                centerX,
                centerY
            );


            createScreenFlash();

        }

        catch (error) {

            console.error(
                "인트로 효과 오류:",
                error
            );

        }

    });



    /* ================================
       중앙 플래시
    ================================ */

    function createFlash(x, y) {

        const flash =
            document.createElement("span");


        flash.classList.add(
            "flash"
        );


        flash.style.left =
            `${x}px`;

        flash.style.top =
            `${y}px`;


        effectContainer.appendChild(
            flash
        );


        window.setTimeout(() => {

            flash.remove();

        }, 1200);

    }



    /* ================================
       화면 전체 플래시
    ================================ */

    function createScreenFlash() {

        const screenFlash =
            document.createElement("span");


        screenFlash.classList.add(
            "screen-flash"
        );


        effectContainer.appendChild(
            screenFlash
        );


        window.setTimeout(() => {

            screenFlash.remove();

        }, 1800);

    }



    /* =========================================
       SPARK 포스터 스타일 파티클
    ========================================= */

    function createPosterParticles(x, y) {


        /* ================================
           사용할 도형

           spike     = 뾰족한 파편
           arrow     = 화살표
           ring      = 테두리 원
           burst     = 폭발 별
           triangle  = 삼각형
           slash     = 긴 사선
           circle    = 원
           diamond   = 마름모
        ================================ */

        const shapes = [

            "spike",
            "arrow",
            "ring",
            "burst",

            "triangle",
            "slash",
            "circle",
            "diamond"

        ];



        /* ================================
           포스터 컬러
        ================================ */

        const colors = [

            "#EF174D",  // 핑크
            "#30483F",  // 다크 그린
            "#9BDCE8",  // 하늘색
            "#FFFFFF",  // 흰색

            "#EF174D",
            "#30483F",
            "#9BDCE8",
            "#EE4045"   // 레드
        ];



        /* ================================
           도형 크기

           랜덤이 아니라 정해진 패턴을
           반복해서 사용
        ================================ */

        const sizePattern = [

            22,
            34,
            46,
            62,
            82

        ];



        /* 긴 도형의 길이 */

        const lengthPattern = [

            80,
            115,
            150,
            190

        ];



        /* 애니메이션 속도 */

        const durationPattern = [

            1.28,
            1.36,
            1.44

        ];



        /* ================================
           파티클 개수
        ================================ */

        const amount = 160;



        /* ================================
           파티클 생성
        ================================ */

        for (
            let i = 0;
            i < amount;
            i += 1
        ) {


            const particle =
                document.createElement(
                    "span"
                );



            /* ================================
               도형 선택

               랜덤이 아니라 순서대로 반복
            ================================ */

            const shape =
                shapes[
                    i %
                    shapes.length
                ];



            /* 색상 선택 */

            const color =
                colors[
                    i %
                    colors.length
                ];



            particle.classList.add(
                "poster-particle",
                shape
            );



            /* ================================
               폭발 방향

               360도를 균등하게 분배
            ================================ */

            const angleOffset =

                (
                    (i % 7) - 3
                )

                * 0.012;



            const angle =

                (
                    Math.PI *
                    2 *
                    i
                )

                / amount

                + angleOffset;



            /* ================================
               이동 거리

               가까운 파티클부터
               화면 밖까지 나가는 파티클까지
            ================================ */

            const distancePattern = [

                360,
                500,
                660,
                820,
                980

            ];



            const distance =

                distancePattern[
                    i %
                    distancePattern.length
                ];



            /* 좌우 방향은 조금 더 넓게 */

            const moveX =

                Math.cos(angle)

                * distance

                * 1.12;



            const moveY =

                Math.sin(angle)

                * distance;



            /* ================================
               크기
            ================================ */

            const size =

                sizePattern[
                    i %
                    sizePattern.length
                ];



            /* 긴 도형 길이 */

            const length =

                lengthPattern[
                    i %
                    lengthPattern.length
                ];



            /* ================================
               회전
            ================================ */

            const rotate =

                (
                    (i * 47) %
                    720
                )

                - 360;



            /* ================================
               애니메이션 시간
            ================================ */

            const duration =

                durationPattern[
                    i %
                    durationPattern.length
                ];



            /* 아주 미세한 시간차 */

            const delay =

                (i % 8)

                * 0.008;



            /* ================================
               시작 위치
            ================================ */

            particle.style.left =
                `${x}px`;

            particle.style.top =
                `${y}px`;



            /* ================================
               CSS 변수 전달
            ================================ */

            particle.style.setProperty(
                "--move-x",
                `${moveX}px`
            );


            particle.style.setProperty(
                "--move-y",
                `${moveY}px`
            );


            particle.style.setProperty(
                "--rotate",
                `${rotate}deg`
            );


            particle.style.setProperty(
                "--size",
                `${size}px`
            );


            particle.style.setProperty(
                "--length",
                `${length}px`
            );


            particle.style.setProperty(
                "--duration",
                `${duration}s`
            );


            particle.style.setProperty(
                "--delay",
                `${delay}s`
            );


            particle.style.setProperty(
                "--scale",
                "1"
            );


            particle.style.setProperty(
                "--stroke",
                "3px"
            );


            particle.style.setProperty(
                "--color",
                color
            );



            /* 화면에 추가 */

            effectContainer.appendChild(
                particle
            );



            /* ================================
               애니메이션 종료 후 제거
            ================================ */

            window.setTimeout(() => {

                particle.remove();

            }, 1900);

        }

    }

});