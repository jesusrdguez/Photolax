import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vote-button" [class.voted]="isVoted" [title]="isVoted ? 'Unlike' : 'Like'">
      <button class="vote-btn" (click)="onVoteChange($event)">
        <span class="vote-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
        <span class="vote-text">{{ isVoted ? 'Voted' : 'Vote' }}</span>
      </button>
    </div>
  `,
  styles: [`
    .vote-button {
      --vote-color: rgb(255, 91, 137);
      --vote-bg: rgba(255, 91, 137, 0.1);
      --vote-hover: rgba(255, 91, 137, 0.2);
    }

    .vote-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 2px solid var(--vote-color);
      border-radius: 20px;
      background: transparent;
      color: var(--vote-color);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .vote-btn:hover {
      background: var(--vote-hover);
      transform: translateY(-2px);
    }

    .vote-icon {
      display: flex;
      align-items: center;
    }

    .vote-icon svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
      transition: transform 0.3s ease;
    }

    .vote-btn:hover .vote-icon svg {
      transform: scale(1.2);
    }

    .voted .vote-btn {
      background: var(--vote-color);
      color: white;
    }

    .voted .vote-btn:hover {
      background: var(--vote-color);
      opacity: 0.9;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .voted .vote-icon svg {
      animation: pulse 0.3s ease;
    }
  `]
})
export class VoteButtonComponent {
  @Input() isVoted: boolean = false;
  @Output() voteChange = new EventEmitter<boolean>();

  onVoteChange(event: Event) {
    event.preventDefault();
    this.voteChange.emit(!this.isVoted);
  }
} 