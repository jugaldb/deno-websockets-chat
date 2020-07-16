import {
  WebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

let sockets = new Map<string, WebSocket>();

interface BroadcastObj{
    name:string,
    mssg:string
}

///Broadcast events

const broadcastEvent = (obj:BroadcastObj)=>{
    sockets.forEach((ws:WebSocket)=>{
        ws.send(JSON.stringify(obj))
    })
}
//////to do: check the working 

const chatConenction = async (ws: WebSocket) => {
  //add new ws connecton to map
  const uid = v4.generate();
  sockets.set(uid, ws);

  for await (const ev of ws) {
    console.log(ev);

    //delete socket if connn closed
    if(isWebSocketCloseEvent(ev)){
        sockets.delete(uid)
    }

    //create ev object if ev is string

    if (typeof ev === "string") {
      let evObj = JSON.parse(ev);
      broadcastEvent(evObj)
    }
  }
};

export { chatConenction };
