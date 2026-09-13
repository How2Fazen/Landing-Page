const CONFIG = {
      whatsapp: "51999999999",
      currency: "S/",
      locale: "es-PE"
    };

    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const clamp = (value, min, max) => {
      return Math.min(Math.max(value, min), max);
    };

    const formatMoney = (value) => {
      return `${CONFIG.currency}${Number(value).toLocaleString(CONFIG.locale)}`;
    };

    const openWhatsApp = (message) => {
      const url =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank", "noopener,noreferrer");
    };

    const progressBar = qs(".scroll-progress__bar");

    const updateScrollProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        scrollable > 0
          ? (window.scrollY / scrollable) * 100
          : 0;

      progressBar.style.width =
        `${clamp(progress, 0, 100)}%`;
    };

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true
    });

    updateScrollProgress();

    const nav = qs(".nav");

    const updateNav = () => {
      nav.classList.toggle(
        "is-scrolled",
        window.scrollY > 20
      );
    };

    window.addEventListener("scroll", updateNav, {
      passive: true
    });

    updateNav();

    const navLinks = qsa(".nav__links a");

    const sectionsForNav =
      qsa("main section[id]");

    const navObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const id = entry.target.id;

            navLinks.forEach((link) => {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${id}`
              );
            });
          });
        },
        {
          rootMargin: "-38% 0px -55% 0px",
          threshold: 0
        }
      );

    sectionsForNav.forEach((section) => {
      navObserver.observe(section);
    });

    const reveals = qsa(".reveal");

    const revealObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        {
          threshold: .11
        }
      );

    reveals.forEach((element) => {
      revealObserver.observe(element);
    });

    const cursorDot = qs(".cursor-dot");
    const cursorRing = qs(".cursor-ring");
    const mouseGlow = qs(".mouse-glow");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const canUseCursor =
      window.matchMedia("(pointer: fine)").matches;

    if (canUseCursor) {
      window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        mouseGlow.style.left = `${mouseX}px`;
        mouseGlow.style.top = `${mouseY}px`;
      });

      const animateCursor = () => {
        ringX += (mouseX - ringX) * .14;
        ringY += (mouseY - ringY) * .14;

        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);
      };

      animateCursor();

      qsa(
        "a, button, .service-tile, .price-card, .quote-option"
      ).forEach((element) => {
        element.addEventListener("mouseenter", () => {
          cursorRing.classList.add("is-active");
        });

        element.addEventListener("mouseleave", () => {
          cursorRing.classList.remove("is-active");
        });
      });
    }

    if (canUseCursor) {
      qsa(".magnetic").forEach((element) => {
        element.addEventListener("mousemove", (event) => {
          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          element.style.transform =
            `translate(${x * .10}px, ${y * .10}px)`;
        });

        element.addEventListener("mouseleave", () => {
          element.style.transform = "";
        });
      });
    }

    if (canUseCursor) {
      qsa(".tilt").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          const rotateY =
            (x - .5) * 3.5;

          const rotateX =
            (y - .5) * -3.5;

          card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });
    }

    const signalSwitch =
      qs(".signal-switch");

    const signalConsole =
      qs(".signal-console");

    let signalMode = 0;

    signalSwitch.addEventListener("click", () => {
      signalMode = (signalMode + 1) % 3;

      const modes = [
        {
          rotate: "-1.3deg",
          accent: "#c9ff2f"
        },
        {
          rotate: "1.2deg",
          accent: "#ff6b35"
        },
        {
          rotate: "-.3deg",
          accent: "#8f7cff"
        }
      ];

      const mode = modes[signalMode];

      signalConsole.style.transform =
        `rotate(${mode.rotate})`;

      document.documentElement.style.setProperty(
        "--accent",
        mode.accent
      );
    });

    const pricingButtons =
      qsa(".pricing-switcher button");

    const priceValues =
      qsa(".price-card__price");

    const setPricingMode = (mode) => {
      pricingButtons.forEach((button) => {
        button.classList.toggle(
          "is-active",
          button.dataset.mode === mode
        );
      });

      priceValues.forEach((element) => {
        const value =
          mode === "care"
            ? element.dataset.care
            : element.dataset.build;

        element.childNodes[0].nodeValue =
          `\n              ${value}\n              `;

        const suffix =
          qs("[data-suffix]", element);

        suffix.textContent =
          mode === "care"
            ? "mensual / desde"
            : (
              element.dataset.build === "S/2,999"
                ? "desde"
                : "pago único"
            );
      });
    };

    pricingButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setPricingMode(button.dataset.mode);
      });
    });

    qsa(".plan-button").forEach((button) => {
      button.addEventListener("click", () => {
        const plan = button.dataset.plan;

        const message =
          `Hola 👋\n\n` +
          `Estoy interesado en el plan ${plan}.\n` +
          `Quisiera conocer el alcance exacto y recibir una cotización para mi negocio.`;

        openWhatsApp(message);
      });
    });

    const caseData = {
      restaurante: {
        code: "USE CASE / 01",
        title: "Restaurante / Restobar",
        desc:
          "Carta, reservas, pedidos, roles internos y panel para controlar la operación.",
        goal:
          '+ orden<small>menos fricción operativa</small>',
        range:
          'S/1,400+<small>según alcance</small>',
        chips:
          [
            "Carta",
            "Reservas",
            "Pedidos",
            "Dashboard"
          ],
        flow:
          [
            "Cliente",
            "Carta",
            "Pedido",
            "Cocina",
            "Caja"
          ]
      },

      barberia: {
        code: "USE CASE / 02",
        title: "Barbería / Salón",
        desc:
          "Servicios, horarios, reservas y una experiencia visual que haga ver la marca más profesional.",
        goal:
          '+ citas<small>menos mensajes repetidos</small>',
        range:
          'S/900+<small>según agenda</small>',
        chips:
          [
            "Servicios",
            "Agenda",
            "WhatsApp",
            "Galería"
          ],
        flow:
          [
            "Cliente",
            "Servicio",
            "Horario",
            "Reserva",
            "Confirmación"
          ]
      },

      tienda: {
        code: "USE CASE / 03",
        title: "Tienda / Licorería",
        desc:
          "Catálogo, filtros, stock visible y pedidos rápidos desde celular.",
        goal:
          '+ ventas<small>menos fricción al comprar</small>',
        range:
          'S/1,200+<small>según catálogo</small>',
        chips:
          [
            "Productos",
            "Filtros",
            "Stock",
            "Pedidos"
          ],
        flow:
          [
            "Visita",
            "Producto",
            "Carrito",
            "WhatsApp",
            "Venta"
          ]
      },

      empresa: {
        code: "USE CASE / 04",
        title: "Empresa / Servicios",
        desc:
          "Web corporativa, captación de clientes, portafolio y módulos internos si el negocio crece.",
        goal:
          '+ confianza<small>mejor presencia comercial</small>',
        range:
          'S/1,000+<small>según módulos</small>',
        chips:
          [
            "Servicios",
            "Portafolio",
            "Leads",
            "Dashboard"
          ],
        flow:
          [
            "Visita",
            "Servicio",
            "Prueba",
            "Contacto",
            "Lead"
          ]
      }
    };

    const caseTitle =
      qs("#caseTitle");

    const caseDesc =
      qs("#caseDesc");

    const caseCode =
      qs("#caseCode");

    const caseGoal =
      qs("#caseGoal");

    const caseRange =
      qs("#caseRange");

    const caseChips =
      qs("#caseChips");

    const caseFlow =
      qs("#caseFlow");

    const caseButtons =
      qsa(".case-rail__nav button");

    const renderCase = (key) => {
      const data = caseData[key];

      caseCode.textContent =
        data.code;

      caseTitle.textContent =
        data.title;

      caseDesc.textContent =
        data.desc;

      caseGoal.innerHTML =
        data.goal;

      caseRange.innerHTML =
        data.range;

      caseChips.innerHTML =
        data.chips
          .map(
            (chip) =>
              `<span>${chip}</span>`
          )
          .join("");

      caseFlow.innerHTML =
        data.flow
          .map(
            (step) =>
              `<div class="case-flow__step">${step}</div>`
          )
          .join("");
    };

    caseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        caseButtons.forEach((item) => {
          item.classList.remove("is-active");
        });

        button.classList.add("is-active");

        renderCase(
          button.dataset.case
        );
      });
    });

    const quoteOptions =
      qsa(".quote-option");

    const quoteTotal =
      qs("#quoteTotal");

    const quoteSummary =
      qs("#quoteSummary");

    const quoteReset =
      qs("#quoteReset");

    const quoteWhatsApp =
      qs("#quoteWhatsApp");

    const getSelectedOptions = () => {
      return quoteOptions.filter(
        (option) =>
          option.classList.contains(
            "is-selected"
          )
      );
    };

    const updateQuote = () => {
      const selected =
        getSelectedOptions();

      const total =
        selected.reduce(
          (sum, option) =>
            sum +
            Number(option.dataset.price),
          0
        );

      quoteTotal.innerHTML =
        `${formatMoney(total)}` +
        `<small>referencia inicial</small>`;

      if (!selected.length) {
        quoteSummary.innerHTML =
          `
          <div class="quote-result__summary-row">
            <span>Sin módulos seleccionados</span>
            <strong>S/0</strong>
          </div>
          `;

        return;
      }

      quoteSummary.innerHTML =
        selected
          .map((option) => {
            return `
              <div class="quote-result__summary-row">
                <span>${option.dataset.label}</span>
                <strong>${formatMoney(option.dataset.price)}</strong>
              </div>
            `;
          })
          .join("");
    };

    quoteOptions.forEach((option) => {
      option.addEventListener("click", () => {
        option.classList.toggle(
          "is-selected"
        );

        updateQuote();
      });
    });

    quoteReset.addEventListener("click", () => {
      quoteOptions.forEach((option) => {
        option.classList.remove(
          "is-selected"
        );
      });

      updateQuote();
    });

    quoteWhatsApp.addEventListener("click", () => {
      const selected =
        getSelectedOptions();

      if (!selected.length) {
        openWhatsApp(
          "Hola 👋\n\nQuiero cotizar una página web, pero todavía no sé qué módulos necesito."
        );

        return;
      }

      const total =
        selected.reduce(
          (sum, option) =>
            sum +
            Number(option.dataset.price),
          0
        );

      const detail =
        selected
          .map(
            (option) =>
              `• ${option.dataset.label} — ${formatMoney(option.dataset.price)}`
          )
          .join("\n");

      const message =
        `Hola 👋\n\n` +
        `Armé esta referencia desde el cotizador:\n\n` +
        `${detail}\n\n` +
        `Estimado visual: ${formatMoney(total)}\n\n` +
        `Quisiera revisar el alcance real y recibir una cotización final.`;

      openWhatsApp(message);
    });

    updateQuote();

    qsa(".faq-item").forEach((item) => {
      const button =
        qs(".faq-item__button", item);

      const content =
        qs(".faq-item__content", item);

      button.addEventListener("click", () => {
        const isOpen =
          item.classList.contains("is-open");

        qsa(".faq-item").forEach((other) => {
          if (other === item) {
            return;
          }

          other.classList.remove("is-open");

          const otherContent =
            qs(".faq-item__content", other);

          otherContent.style.maxHeight =
            "0px";
        });

        item.classList.toggle(
          "is-open",
          !isOpen
        );

        content.style.maxHeight =
          !isOpen
            ? `${content.scrollHeight}px`
            : "0px";
      });
    });

    const mobilePanel =
      qs(".mobile-panel");

    const menuButton =
      qs(".nav__menu");

    const menuClose =
      qs(".mobile-panel__close");

    const mobileLinks =
      qsa(".mobile-panel__links a");

    const setMenuOpen = (open) => {
      mobilePanel.classList.toggle(
        "is-open",
        open
      );

      mobilePanel.setAttribute(
        "aria-hidden",
        open ? "false" : "true"
      );

      document.body.classList.toggle(
        "is-locked",
        open
      );
    };

    menuButton.addEventListener("click", () => {
      setMenuOpen(true);
    });

    menuClose.addEventListener("click", () => {
      setMenuOpen(false);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });

    mobilePanel.addEventListener("click", (event) => {
      if (event.target === mobilePanel) {
        setMenuOpen(false);
      }
    });

    const mainWhatsApp =
      qs("#mainWhatsApp");

    mainWhatsApp.addEventListener("click", (event) => {
      event.preventDefault();

      openWhatsApp(
        "Hola 👋\n\nQuiero una página web o sistema para mi negocio. ¿Podemos revisar la idea y cotizarla?"
      );
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    let resizeTimer = null;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        qsa(".faq-item.is-open").forEach((item) => {
          const content =
            qs(".faq-item__content", item);

          content.style.maxHeight =
            `${content.scrollHeight}px`;
        });
      }, 120);
    });

    qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href =
          link.getAttribute("href");

        if (
          !href ||
          href === "#"
        ) {
          return;
        }

        const target =
          qs(href);

        if (!target) {
          return;
        }

        event.preventDefault();

        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          82;

        window.scrollTo({
          top,
          behavior: "smooth"
        });
      });
    });
