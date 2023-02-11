import {defineStore} from 'pinia'
import {ins} from "@/class/Client";
import {useInstanceDetail} from "@/stores/Instance/DetailStore";

interface IWebSocketPacket {
    type: string,
    data: any,
    msg?: string | null
}

interface IWebSocketStore {
    conn: WebSocket | null,
    event: ((data: IWebSocketPacket) => void)[]
}

export const useWebSocketStore = defineStore('WebSocketStore', {
    state: (): IWebSocketStore => ({
        conn: null,
        event: []
    }),
    actions: {
        listen(callback: (data: IWebSocketPacket) => void) {
            const id = this.event.push(callback) - 1;
            return () => {
                delete this.event[id];
            };
        },
        init() {
            const detail = useInstanceDetail();
            ins.getConsole(detail.id!!, res => {
                const ws = new WebSocket(res.data.attributes.endpoint + '?instance=' + detail.uuid + '&token=' + res.data.attributes.token);
                ws.onmessage = (e: { data: string; }) => {
                    this.event.forEach(te => {
                        te(JSON.parse(e.data));
                    });
                }
                this.conn = ws;

                this.listen((data) => {
                    if (data.type == 'status') {
                        detail.status = data.data;
                    }
                })
            });
        },
        send(data: IWebSocketPacket) {
            this.conn?.send(JSON.stringify(data));
        },
        close() {
            this.conn?.close();
        }
    }
})

export type {IWebSocketPacket};