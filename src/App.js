import React, { useEffect, useRef } from "react";
import "./styles.css";
import {Message, useMessages} from "@chatui/core";
import { nanoid } from 'nanoid';
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

export default function App() {
  const wrapper = useRef();
  const { messages, appendMsg, setTyping } = useMessages([]);

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      config: {
        navbar: {
          title: "小愈"
        },
        robot: {
          avatar: "https://z1.ax1x.com/2023/11/15/piYlmjO.png"
        },
        messages: [
          {
            type: "text",
            content: {
              text: "我是小愈，你的专属心理咨询师，请问有什么可以帮您？"
            }
          }
        ]
      },
      requests: {
        send: function (msg) {
          if (msg.type === 'text') {
            return {
              url: 'http://localhost:5000/test',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_input: msg.content.text
              })
            };
          }
        }
      },
      handlers: {
        parseResponse(res, requestType) {
          if (requestType === 'send' && res.result) {
            return [{
              _id: nanoid(), type: 'text', content: {text: res.result}, position: 'left',hasTime: true,
            }];
          }

          }
        },
    });
    bot.run();
  }, []);

  return <div style={{ height: "100%" }} ref={wrapper} />;
}
