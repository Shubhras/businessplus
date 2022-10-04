import { Injectable } from "@angular/core";
import { Task } from "app/main/apps/_models/task";

@Injectable()
export class TaskService {
    get(): Promise<Task[]> {
        return Promise.resolve([
            { "id": 11, "text": "Project #1", "type": "project", "progress": 0.6, "open": true, "color": "#039be5" },
            { "id": 13, "text": "Activity #2", "start_date": "03-04-2018", "type": "project", "parent": "11", "progress": 0.5, "open": true, "color": "#548ca7" },
            { "id": 15, "text": "Activity #4", "type": "project", "parent": "11", "progress": 0.2, "open": true, "color": "#548ca7" },

            { "id": 16, "text": "milestone 2", "start_date": "13-04-2018", "type": gantt.config.types.milestone, "parent": "11", "progress": 0, "open": true, "color": "#FFD933" },
            { "id": 17, "text": "Sub activity #2.1", "start_date": "03-04-2018", "duration": "2", "parent": "13", "progress": 1, "open": true, "color": "#FFD933" },
            { "id": 18, "text": "Sub activity #2.2", "start_date": "06-04-2018", "duration": "3", "parent": "13", "progress": 0.8, "open": true, "color": "#FFD933" },
            { "id": 19, "text": "Sub activity #2.3", "start_date": "10-04-2018", "duration": "4", "parent": "13", "progress": 0.2, "open": true, "color": "#FFD933" },
            { "id": 20, "text": "Sub activity #2.4", "start_date": "10-04-2018", "duration": "4", "parent": "13", "progress": 0, "open": true, "color": "#FFD933" },

            { "id": 21, "text": "Sub activity #4.1", "start_date": "02-04-2018", "duration": "4", "parent": "15", "progress": 0.5, "open": true, "color": "#FFD933" },
            { "id": 22, "text": "Sub activity #4.2", "start_date": "02-04-2018", "duration": "4", "parent": "15", "progress": 0.1, "open": true, "color": "#FFD933" },
            { "id": 23, "text": "milestone 1", "start_date": "12-04-2018", "type": "milestone", "parent": "15", "progress": 0, "open": true, "color": "#FFD933" }
        ]);
    }
}
