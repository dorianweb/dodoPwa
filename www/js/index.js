window.vue = new Vue({
  el: "#app",
  data: {
    current: "home",
    topName: "none",
    isSavedTopName: false,
    isPluginAvailable: false,
    tops: {},

    item: {
      position: 1,
      name: "",
    },
  },
  mounted() {
    if (localStorage.getItem("tops"))
      this.tops = JSON.parse(localStorage.getItem("tops"));
  },
  methods: {
    setCurrent: function (curr, selectedTopName = "", needReset = true) {
      this.current = curr;
      if (needReset) {
        this.isSavedTopName = false;
        this.topName = curr == "detail" ? selectedTopName : "none";
        this.item.position = 1;
        this.item.name = "";
      }
    },

    addItem: function (e) {
      sortedItems = _.cloneDeep(this.tops[this.topName]);
      clonedItem = _.cloneDeep(this.item);
      if (
        sortedItems.filter((elem) => elem.name == clonedItem.name).length ==
          0 &&
        clonedItem.name.length > 0
      ) {
        if (sortedItems.length > 0) {
          for (let i = 0; i < sortedItems.length; i++) {
            if (sortedItems[i].position >= clonedItem.position) {
              sortedItems[i] = {
                ...sortedItems[i],
                position: Number.parseInt(sortedItems[i].position) + 1,
              };
            }
          }
        }

        clonedItem.position = Number.parseInt(clonedItem.position);
        sortedItems = [...sortedItems, clonedItem];

        sortedItems = _.sortBy(sortedItems, ["position"]);
        //met a jour le top
        this.tops = {
          ...this.tops,
          [this.topName]: sortedItems,
        };
        this.item.position = sortedItems.length + 1;
        this.item.name = "";
        if (this.isPluginAvailable) {
          navigator.vibrate(500);
        }
      }
    },
    validateTopName: function (e) {
      indexs = Object.keys(this.tops);
      if (indexs.indexOf(this.topName) == -1) {
        this.tops = {
          ...this.tops,
          [this.topName]: [],
        };
        this.isSavedTopName = true;
        if (this.isPluginAvailable) {
          navigator.vibrate([500, 300, 500]);
        }
      }
    },
  },
  watch: {
    tops: function () {
      localStorage.setItem("tops", JSON.stringify(this.tops));
    },
    current: function (neo, old) {
      if (neo == "home" && old == "add") {
        if (this.isPluginAvailable) {
          navigator.notification.alert("top ajouter avec succes", () => {});
        }
      }
    },
  },
});

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  StatusBar.overlaysWebView(true);
  StatusBar.backgroundColorByHexString("#EE4466");

  if (
    typeof navigator.vibrate !== "unedefined" &&
    typeof navigator.notification !== "unedefined"
  ) {
    //window.vue.navigator = navigator;
    window.vue.isPluginAvailable = true;
    //navigator.notification.vibrate(1000);
  }
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
}
document.addEventListener("deviceready", onDeviceReady, false);
