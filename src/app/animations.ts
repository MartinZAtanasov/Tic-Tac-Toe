import { query, style, animate, group, transition, trigger, keyframes } from '@angular/animations';


export const popMark = trigger('popMark', [
    transition(':enter', [
        style({transform: 'scale(0)'}),
        animate('.4s ease', keyframes([
            style({ transform: 'scale(0)', offset: 0}),
            style({ transform: 'scale(1.3)', offset: .33 }),
            style({ transform: 'scale(0.7)', offset: 0.66}),
            style({ transform: 'scale(1)', offset: 1 }),
        ]))
    ])
])