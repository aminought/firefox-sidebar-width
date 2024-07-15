(function sidebar_width() {
    'use strict';

    const TIMEOUT = 1000;
    const PREF = 'sidebar.widths';

    class SidebarWidth {
        constructor() {
            this.sidebarWidths = this.initWidth();
            this.observer = this.createSidebarBoxObserver();
        }

        initWidth() {
            try {
                return JSON.parse(Services.prefs.getStringPref(PREF));
            } catch (error) {
                return Object.fromEntries(
                    Array.from(SidebarController.sidebars.keys()).map((key) => [
                        key,
                        this.getCurrentWidth(),
                    ])
                );
            }
        }

        createSidebarBoxObserver() {
            const observer = new MutationObserver((records) => {
                for (const record of records) {
                    if (record.type === 'attributes' && record.attributeName === 'style') {
                        this.saveWidth();
                        break;
                    }
                    if (record.type === 'attributes' && record.attributeName === 'sidebarcommand') {
                        this.restoreWidth();
                        break;
                    }
                }
            });
            observer.observe(SidebarController._box, { attributes: true });
            return observer;
        }

        saveWidth() {
            this.sidebarWidths[this.getCurrentCommand()] = this.getCurrentWidth();
            Services.prefs.setStringPref(PREF, JSON.stringify(this.sidebarWidths));
        }

        restoreWidth() {
            SidebarController._box.style.width = this.sidebarWidths[this.getCurrentCommand()];
        }

        getCurrentWidth() {
            return SidebarController._box.style.width;
        }

        getCurrentCommand() {
            return SidebarController._box.getAttribute('sidebarcommand');
        }
    }

    var interval = setInterval(() => {
        if (document.querySelector('#browser')) {
            window.sidebarWidth = new SidebarWidth();
            clearInterval(interval);
        }
    }, TIMEOUT);
})();
