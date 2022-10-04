import { Injectable } from "@angular/core";
import { Link } from "app/main/apps/_models/link";

@Injectable()
export class LinkService {
    get(): Promise<Link[]> {
        return Promise.resolve([
            { "id": "14", "source": "13", "target": "15", "type": "0" },
            { "id": "15", "source": "15", "target": "16", "type": "0" },
            { "id": "16", "source": "17", "target": "18", "type": "0" },
            { "id": "17", "source": "18", "target": "19", "type": "0" },
            { "id": "18", "source": "19", "target": "20", "type": "0" }
        ]);
    }
}