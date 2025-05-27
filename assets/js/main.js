// Khi DOM được tải xong hoàn toàn
document.addEventListener("DOMContentLoaded", function () {
  /*************** Scroll Progress ***************/
  // Hàm cập nhật tiến trình cuộn trang và gán vào biến CSS --scroll-progress
  const updateScrollProgress = () => {
    // Lấy vị trí cuộn hiện tại của người dùng
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    // Tính tổng chiều cao có thể cuộn (tổng chiều cao tài liệu - chiều cao viewport)
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    // Tính tỷ lệ cuộn: 0 (chưa cuộn) đến 1 (cuộn đến cuối trang)
    const progress = scrollTop / scrollHeight;

    // Gán giá trị tiến trình cuộn vào biến CSS custom property
    document.documentElement.style.setProperty("--scroll-progress", progress);
  };

  // Gọi updateScrollProgress mỗi khi có sự kiện cuộn
  window.addEventListener("scroll", updateScrollProgress);

  // Gọi lần đầu để thiết lập giá trị ban đầu (trường hợp người dùng tải giữa trang)
  updateScrollProgress();

  /*************** Navbar 3D Hover ***************/
  // Lấy tất cả các liên kết trên navbar có thuộc tính data-js-nav-link
  const navLinks = document.querySelectorAll("[data-js-nav-link]");

  // Áp dụng hiệu ứng hover 3D cho từng liên kết
  navLinks.forEach((link) => {
    // Khi chuột di chuyển vào liên kết
    link.addEventListener("mouseenter", (e) => {
      // Tạo hiệu ứng nổi nhẹ và đổ bóng chữ
      e.target.style.transform = "translateY(-3px) translateZ(10px)";
      e.target.style.textShadow = "0 4px 8px rgba(52, 200, 219, 0.3)";
    });

    // Khi chuột rời khỏi liên kết
    link.addEventListener("mouseleave", (e) => {
      // Đặt lại hiệu ứng về trạng thái ban đầu
      e.target.style.transform = "";
      e.target.style.textShadow = "";
    });
  });

  /*************** Navbar Scroll Effect ***************/
  // Lấy phần tử navbar và logo
  const navbar = document.querySelector("[data-js-nav]");
  const logo = document.querySelector("[data-js-logo]");

  // Thêm hiệu ứng khi người dùng cuộn trang
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Làm mờ nền navbar theo độ cuộn
    navbar.style.backdropFilter = `blur(${Math.min(15, 8 + scrollY / 30)}px)`;

    // Thu nhỏ logo dần khi cuộn xuống (giữ lại hiệu ứng nổi 3D)
    logo.style.transform = `scale(${Math.max(
      0.9,
      1 - scrollY / 1000
    )}) translateZ(20px)`;
  });

  /*************** Smooth Scroll for Anchors ***************/
  // Áp dụng cho tất cả liên kết có href bắt đầu bằng dấu "#"
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Ngăn hành vi mặc định của trình duyệt
      e.preventDefault();

      // Tìm phần tử mục tiêu có ID tương ứng với href của liên kết
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        // Cuộn mượt đến phần tử mục tiêu (trừ đi 80px để chừa khoảng cho navbar)
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });

        // Loại bỏ lớp "active" khỏi tất cả liên kết
        navLinks.forEach((link) => link.classList.remove("active"));

        // Thêm lớp "active" cho liên kết đang được nhấn
        this.classList.add("active");
      }
    });
  });

  /*************** Card 3D Hover ***************/
  // Lấy tất cả các thẻ có class "card-3d"
  const cards = document.querySelectorAll(".card-3d");
  cards.forEach((card) => {
    // Khi di chuyển chuột trên thẻ
    card.addEventListener("mousemove", (e) => {
      // Lấy kích thước và vị trí thẻ
      const rect = card.getBoundingClientRect();
      // Tính vị trí X, Y tương đối bên trong thẻ
      const x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      // Tính toán góc xoay theo X và Y để tạo hiệu ứng 3D
      const angleX = (y - rect.height / 2) / 20;
      const angleY = (rect.width / 2 - x) / 20;

      // Áp dụng hiệu ứng xoay và nổi nhẹ
      card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(20px)`;

      // Thêm đổ bóng để tạo chiều sâu
      card.style.boxShadow = `${angleY * 2}px ${
        angleX * 2
      }px 30px rgba(0,0,0,0.2)`;
    });

    // Khi chuột rời khỏi thẻ
    card.addEventListener("mouseleave", () => {
      // Đặt lại hiệu ứng về trạng thái ban đầu
      card.style.transform = "translateZ(0)";
      card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
    });
  });

  /*************** Theme Toggle ***************/
  // Tìm phần tử container bên trong navbar
  const navContainer = document.querySelector(".navbar .container");
  if (navContainer) {
    // Tạo nút chuyển đổi theme (dark/light)
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "theme-toggle";
    toggleBtn.className = "btn btn-sm ms-3";
    // Hỗ trợ trình đọc màn hình
    toggleBtn.setAttribute("aria-label", "Toggle theme");
    // Icon mặc định là moon
    toggleBtn.innerHTML = `<i class="fas fa-moon theme-icon"></i>`;
    // Thêm nút vào navbar
    navContainer.appendChild(toggleBtn);

    // Hàm cập nhật icon của nút theo theme
    const updateToggleIcon = (theme) => {
      const icon = toggleBtn.querySelector("i");
      if (icon)
        icon.className =
          // Nếu theme là dark thì icon là sun, ngược lại
          theme === "dark" ? "fas fa-sun theme-icon" : "fas fa-moon theme-icon";
    };

    // Hàm áp dụng theme (dark hoặc light)
    const applyTheme = (theme) => {
      // Đặt thuộc tính data-theme cho root
      document.documentElement.setAttribute("data-theme", theme);
      // Lưu theme vào localStorage
      localStorage.setItem("theme", theme);
      // Cập nhật icon
      updateToggleIcon(theme);
    };

    // Hàm khởi tạo theme khi load trang
    const initTheme = () => {
      // Lấy theme đã lưu nếu có
      const saved = localStorage.getItem("theme");
      // Kiểm tra theme hệ thống
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      // Ưu tiên theme đã lưu, nếu không thì dùng theo hệ thống
      applyTheme(saved || (systemDark ? "dark" : "light"));
    };

    // Lắng nghe sự kiện click vào nút toggle để chuyển đổi theme
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      // Nếu đang là dark thì chuyển sang light và ngược lại
      applyTheme(current === "dark" ? "light" : "dark");
    });

    // Theo dõi thay đổi theme của hệ điều hành nếu user chưa lưu lựa chọn
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Nếu chưa có theme được lưu
        if (!localStorage.getItem("theme"))
          // Tự động áp dụng theo hệ điều hành
          applyTheme(e.matches ? "dark" : "light");
      });

    // Gọi hàm khởi tạo theme ban đầu
    initTheme();
  }

  /*************** Typing Effect ***************/
  // Lấy phần tử hiển thị văn bản và con trỏ
  const typingText = document.querySelector(".typing-text");
  const cursor = document.querySelector(".cursor");
  if (typingText && cursor) {
    // Nội dung muốn gõ
    const text = "Web Developer Intern";
    let charIndex = 0,
      isDeleting = false;

    // Hàm tạo hiệu ứng gõ và xóa chữ liên tục
    const typeWriter = () => {
      // Hiển thị từng ký tự
      typingText.textContent = text.substring(0, charIndex);

      // Nhấp nháy con trỏ
      cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";

      if (!isDeleting && charIndex < text.length) {
        // Đang gõ
        charIndex++;
        setTimeout(typeWriter, 150);
      } else if (!isDeleting && charIndex === text.length) {
        // Dừng một chút sau khi gõ xong
        isDeleting = true;
        setTimeout(typeWriter, 2000);
      } else if (isDeleting && charIndex > 0) {
        // Đang xóa
        charIndex--;
        setTimeout(typeWriter, 100);
      } else {
        // Bắt đầu lại quá trình gõ
        isDeleting = false;
        setTimeout(typeWriter, 500);
      }
    };

    // Bắt đầu hiệu ứng sau 1 giây
    setTimeout(typeWriter, 1000);
  }

  /*************** Profile 3D Hover ***************/
  // Lấy phần tử profile có hiệu ứng 3D hover
  const profile = document.querySelector('[data-js="profile-3d"]');

  if (profile) {
    // Khi di chuột trên phần tử profile
    profile.addEventListener("mousemove", (e) => {
      // Lấy vị trí và kích thước phần tử
      const rect = profile.getBoundingClientRect();

      // Tính tọa độ con trỏ chuột relative đến phần tử
      const x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      // Tính góc xoay dựa trên vị trí con trỏ
      const angleX = (y - rect.height / 2) / 20;
      const angleY = (rect.width / 2 - x) / 20;

      // Áp dụng transform xoay 3D cho phần tử profile
      profile.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;

      // Hiệu ứng chói (glare) ánh sáng trên profile
      const glare = profile.querySelector(".profile-glare");
      if (glare)
        glare.style.background = `linear-gradient(${
          angleY * 10
        }deg, rgba(255,255,255,0.3), rgba(255,255,255,0))`;
    });

    // Khi rời chuột khỏi phần tử profile
    profile.addEventListener("mouseleave", () => {
      // Reset lại transform về trạng thái ban đầu
      profile.style.transform = "rotateX(0) rotateY(0)";

      // Reset lại hiệu ứng chói ánh sáng
      const glare = profile.querySelector(".profile-glare");
      if (glare)
        glare.style.background = `linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))`;
    });
  }

  /*************** Intersection Observer Animation ***************/
  // Tạo observer theo dõi phần tử khi xuất hiện trong viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          // Thêm class khi phần tử xuất hiện trong viewport
          el.classList.add("in-view");

          // Nếu phần tử là thanh tiến trình kỹ năng, set chiều rộng theo data-width
          if (el.classList.contains("skill-progress")) {
            el.style.width = el.dataset.width;
          }
        } else {
          // Loại bỏ class khi phần tử không còn trong viewport
          el.classList.remove("in-view");
        }
      });
    },
    // Kích hoạt khi phần tử hiển thị 10% trong viewport
    { threshold: 0.1 }
  );

  // Quan sát các phần tử cần animation khi scroll vào view
  document
    .querySelectorAll(".animate-on-scroll, .skill-progress, .timeline-item")
    .forEach((el) => {
      observer.observe(el);
    });

  /*************** Back to Top ***************/
  // Lấy nút Back to Top
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      // Hiển thị nút khi scroll vượt quá 300px
      backToTopBtn.classList.toggle("active", window.scrollY > 300);
    });

    // Khi click nút, cuộn về đầu trang với hiệu ứng smooth
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /*************** Particles.js ***************/
  // Kiểm tra xem thư viện particlesJS đã được tải chưa
  if (typeof particlesJS !== "undefined" && window.innerWidth > 768) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80, // Giảm số lượng để tối ưu
          density: {
            enable: true,
            value_area: 1000,
          },
        },
        color: {
          value: [
            "var(--primary)",
            "var(--accent)", // Giảm màu để đồng nhất
            "rgba(255,255,255,0.5)",
          ],
        },
        shape: {
          type: "circle", // Đơn giản hóa
          stroke: {
            width: 0,
            color: "transparent",
          },
        },
        opacity: {
          value: 0.6, // Tăng độ nhìn thấy
          random: true,
          anim: {
            enable: false, // Tắt animation để mượt
          },
        },
        size: {
          value: 2.5, // Nhỏ hơn
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 130, // Khoảng cách ngắn hơn
          color: "var(--primary)",
          opacity: 0.3, // Mờ hơn
          width: 0.8,
        },
        move: {
          enable: true,
          speed: 1.2, // Chậm hơn
          direction: "none",
          random: true,
          straight: false,
          out_mode: "bounce",
          bounce: false,
          attract: {
            enable: true,
            rotateX: 800,
            rotateY: 1600,
          },
        },
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: {
            enable: true,
            mode: "connect", // Chế độ kết nối tinh tế
            parallax: {
              enable: true,
              force: 15,
              smooth: 12,
            },
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          connect: {
            distance: 140,
            links: {
              opacity: 0.5,
            },
            radius: 200,
          },
          push: {
            particles_nb: 3,
            color: "var(--accent)",
          },
        },
      },
      retina_detect: true,
      fps_limit: 60, // Giới hạn FPS
      config_demo: {
        hide_card: true,
      },
    });

    // Tối ưu khi resize
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (typeof pJSDom !== "undefined" && pJSDom[0]) {
          pJSDom[0].pJS.fn.vendors.destroypJS();
          if (window.innerWidth > 768) {
            pJSDom[0].pJS.fn.vendors.start();
          }
        }
      }, 250);
    });
  }
});
