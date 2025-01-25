import { NgModule } from "@angular/core";
import { CurrencyExchangePipe } from "./currency.pipe";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [CurrencyExchangePipe],
    imports: [CommonModule],
    exports: [CurrencyExchangePipe]
})

export class PipesModule {}