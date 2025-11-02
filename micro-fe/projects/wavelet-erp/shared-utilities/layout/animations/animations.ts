import {animate, state, style, transition, trigger} from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'min-width': '50px',
      'width': '76px'
    })
  ),
  state('open',
    style({
      'min-width': '200px',
      'width': '216px'
    })
  ),
  transition('close <=> open', animate('250ms ease-in'))
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': '76px'
    })
  ),
  state('open',
    style({
      'margin-left': '200px'
    })
  ),
  state('mobile',
    style({
      'margin-left': '0px'
    })
  ),
  transition('close <=> open', animate('250ms ease-in')),
  transition('close <=> mobile', animate('250ms ease-in')),
]);


export const animateText = trigger('animateText', [
  state('hide',
    style({
      'display': 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      'display': 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);
