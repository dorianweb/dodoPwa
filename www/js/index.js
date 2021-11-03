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
      console.log(arguments);
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
        console.log(sortedItems);
        //met a jour le top
        this.tops = {
          ...this.tops,
          [this.topName]: sortedItems,
        };
        this.item.position = sortedItems.length + 1;
        this.item.name = "";
        if (isPluginAvailable) {
          navigator.vibrate([1000]);
        } else {
          console.log("plugin not available");
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
        if (isPluginAvailable) {
          navigator.vibrate([1000, 1000]);
          if (this.tops.length == 1)
            navigator.notification.alert(
              "Felicitation vous avez crée votre premier top",
              () => {}
            );
        }
      }
    },
  },
  watch: {
    tops: function () {
      console.log("tops as changed");
      localStorage.setItem("tops", JSON.stringify(this.tops));
    },
  },
});

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  window.vue.camera = navigator.camera;
  window.vue.camera = navigator.camera;
  window.vue.isPluginAvailable = true;

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
}
