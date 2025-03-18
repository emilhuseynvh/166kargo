import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { RatesService } from "./rates.service";
import { Auth } from "src/shared/decorators/auth.decorator";
import { CreateRatesDto } from "./dto/create-rates.dto";
import { UpdateRatesDto } from "./dto/update-rates.dto";

@Controller('rates')
export class RatesController {
    constructor(
        private ratesService: RatesService
    ) { }

    @Get()
    async list(@Query(':id') id: number) {
        return await this.ratesService.list(id);
    }

    @Auth()
    @Post()
    async create(@Body() body: CreateRatesDto) {
        return await this.ratesService.create(body);
    }

    @Auth()
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateRatesDto) {
        return await this.ratesService.update(id, body);
    }

    @Auth()
    @Delete(':id')
    async deleteRates(@Param('id') id: number) {
        return await this.ratesService.deleteRates(id);
    }
}
