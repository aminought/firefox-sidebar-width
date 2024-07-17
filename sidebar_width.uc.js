(function sidebar_width() {
  "use strict";

  const TIMEOUT = 1000;
  const PREF = "sidebar.widths";

  class SidebarWidth {
    constructor() {
      this.sidebarWidths = this.initWidth();
      this.addEventListeners();
    }

    initWidth() {
      try {
        return JSON.parse(Services.prefs.getStringPref(PREF));
      } catch (error) {
        const sidebars = Array.from(SidebarController.sidebars.keys());
        return Object.fromEntries(
          sidebars.map((sidebar) => [sidebar, this.width])
        );
      }
    }

    addEventListeners() {
      SidebarController._box.addEventListener("resize", () => this.saveWidth());
      addEventListener("SidebarShown", () => this.restoreWidth());
    }

    saveWidth() {
      if (
        this.command in this.sidebarWidths &&
        this.sidebarWidths[this.command] === this.width
      )
        return;
      this.sidebarWidths[this.command] = this.width;
      Services.prefs.setStringPref(PREF, JSON.stringify(this.sidebarWidths));
    }

    restoreWidth() {
      SidebarController._box.style.width = this.sidebarWidths[this.command];
    }

    get width() {
      return SidebarController._box.style.width;
    }

    get command() {
      return SidebarController._box.getAttribute("sidebarcommand");
    }
  }

  var interval = setInterval(() => {
    if (document.querySelector("#browser")) {
      window.sidebarWidth = new SidebarWidth();
      clearInterval(interval);
    }
  }, TIMEOUT);
})();
