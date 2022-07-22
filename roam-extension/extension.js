export default {
    onload: ({extensionAPI}) => {
        console.log('RoamExtension loaded');
        window['extensionAPI'] = extensionAPI;
    },
    onunload: () => {}
  };