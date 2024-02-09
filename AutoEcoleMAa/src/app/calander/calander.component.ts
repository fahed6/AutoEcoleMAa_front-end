import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calander',
  templateUrl: './calander.component.html',
  styleUrl: './calander.component.css'
})
export class CalanderComponent implements OnInit, AfterViewInit {
  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;
  calendarVisible = true;
  initialEvents: EventInput[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.initialEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventDrop: this.handleEventDrop.bind(this),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };
  currentEvents: EventApi[] = [];
  private calendarApi: Calendar | null = null;

  constructor(private changeDetector: ChangeDetectorRef, private http: HttpClient) {}

  ngOnInit() {
    this.loadEventsFromBackend();
  }

  ngAfterViewInit() {
    if (this.fullCalendar) {
      this.calendarApi = this.fullCalendar.getApi();
      console.log('Calendar API initialized:', this.calendarApi);
    } else {
      console.error('FullCalendar component not found.');
    }
  }

  loadEventsFromBackend() {
    this.http.get<any[]>('http://localhost:8080/api/events/all').subscribe(
      (backendEvents) => {
        const newEvents = backendEvents.map((backendEvent) => ({
          id: backendEvent.id.toString(),
          title: backendEvent.title,
          start: backendEvent.start,
          end: backendEvent.end,
          color: backendEvent.color
        }));
  
        if (this.calendarApi) {
          this.calendarApi.removeAllEvents();
          this.calendarApi.addEventSource(newEvents);
          this.calendarApi.refetchEvents();
        }
  
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error('Error fetching events from the backend', error);
      }
    );
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const typeEvent=prompt('donne type');
    let color;
    if(typeEvent=='test'){
      color='red';
    }
    if(typeEvent=='code'){
      color='green';
    }
    if(typeEvent=='conduit'){
      color='yellow';
    }
    if(typeEvent=='park'){
      color='orange';
    }
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      // Use non-null assertion to tell TypeScript that we've checked for null
      const newEvent = calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        color
      })!;
      console.log('all event',newEvent);
      // Check if newEvent is not null before saving to the backend
      if (newEvent) {
        const headers = { 'Content-Type': 'application/json' };
        const backendEvent = {
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          color: color
        };
        this.http.post<any>('http://localhost:8080/api/events/save', backendEvent, { headers }).subscribe();
      }
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    const eventId = clickInfo.event.id;

    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        // Remove the event from the frontend
        clickInfo.event.remove();

        // Delete the event from the backend
        this.http.delete(`http://localhost:8080/api/events/${eventId}`).subscribe(
            () => {
                console.log(`Event with ID ${eventId} deleted from the backend.`);
            },
            (error) => {
                console.error(`Error deleting event with ID ${eventId} from the backend`, error);
            }
        );
    }
}
handleEventDrop(eventDropInfo: EventDropArg) {
  const updatedEvent = {
      id: eventDropInfo.event.id,
      title: eventDropInfo.event.title,
      start: eventDropInfo.event.start,
      end: eventDropInfo.event.end,
      color:eventDropInfo.event.backgroundColor
  };

  // Send the updated event to the backend
  this.http.put<any>('http://localhost:8080/api/events/update', updatedEvent).subscribe(
      () => {
          console.log('Event updated on the backend after drop.');
      },
      (error) => {
          console.error('Error updating event on the backend after drop', error);
      }
  );
}

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
  
}