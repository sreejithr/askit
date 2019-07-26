const webViewContent = (selectedUpns = "['pajindal@microsoft.com', 'gogoe@microsoft.com']") => `
<html>
  <head>
    <style>
      #compose-box {
        width: 85vw;
        height: 20px;
        background-color: transparent;
        color: rgb(198, 198, 198);
        border: 0;
        border-bottom: 1px solid rgb(198, 198, 198);
        font-size: 14px;
      }
      
      input#compose-box:focus {
        outline: none;
      }

      #compose-section {
        position: absolute;
        bottom: 10px;
        display: flex;
        flex-direction: row;
      }

      #app-frame {
        height: 95vh;
        width: 95vw;
        margin: 0 auto;
        border-width: 0px;
      }

      #send-button {
        border: 1px solid rgb(198, 198, 198);
        border-radius: 3px;
        padding: 0;
        width: 50px;
        margin-left: 10px;
        background-color: transparent;
        color: rgb(198, 198, 198);
      }
    </style>
  </head>
  <body>
    <div id="compose-section">
      <input id="compose-box" placeholder="Type a new message"/>
      <input id="send-button" type="button" value="Send"/>
    </div>
    <script>
      (function() {
        const button = document.getElementById("send-button");
        button.addEventListener("click", sendMessage);
        function sendMessage() {
          const appFrame = document.getElementById("app-frame").contentWindow;
          const message = document.getElementById("compose-box").value;
          appFrame.postMessage(message, 'http://dev.local:3000/#/${selectedUpns}');
          document.getElementById("compose-box").value = "";
        }
        console.log('http://dev.local:3000/#/${selectedUpns}')
      })();
    </script>
    <iframe id="app-frame" src='http://dev.local:3000/#/${selectedUpns}'/>
  </body>
</html>
`;
export default webViewContent;