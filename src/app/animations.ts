import { query, style, animate, transition, trigger, keyframes } from '@angular/animations';


export const popMark = trigger('popMark', [
    transition(':enter', [
        animate('.4s ease', keyframes([
            style({ transform: 'scale(0)', offset: 0}),
            style({ transform: 'scale(1.3)', offset: .33 }),
            style({ transform: 'scale(0.7)', offset: 0.66}),
            style({ transform: 'scale(1)', offset: 1 }),
        ]))
    ])
]);

export const modalPop = trigger('modalPop', [
    transition(':enter', [
        query('.modal', [
            animate('1.2s ease', keyframes([
                style({ transform: 'scale(0)', offset: 0}),
                style({ transform: 'scale(1.3)', offset: .33 }),
                style({ transform: 'scale(1)', offset: 0.66}),
                style({ transform: 'scale(1)', offset: 1 }),
            ]))
        ], {optional: true}),
    ])
]);
