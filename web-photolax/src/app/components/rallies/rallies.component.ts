import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rallies',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="rallies-container">
            <h1>Photo Rallies</h1>
            <!-- Aquí irá el listado de rallies -->
        </div>
    `,
    styles: [`
        .rallies-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
    `]
})
export class RalliesComponent {} 