import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rules',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="rules-container">
            <h1>Contest Rules</h1>
            <!-- Aquí irá el contenido de las reglas -->
        </div>
    `,
    styles: [`
        .rules-container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
    `]
})
export class RulesComponent {} 