import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dto/create-country.dto";
import { Auth } from "src/shared/decorators/auth.decorator";
import { UpdateCountryDto } from "./dto/update-country.dto";

@Controller('country')
export class CountryController {
    constructor(
        private countryService: CountryService
    ) { }
    @Get()
    async list() {
        return await this.countryService.list();
    }

    @Auth()
    @Post()
    async create(@Body() body: CreateCountryDto) {
        return await this.countryService.create(body);
    }

    @Auth()
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateCountryDto) {
        return await this.countryService.update(id, body);
    }

    @Auth()
    @Delete(':id')
    async deleteCountry(@Param('id') id: number) {
        return await this.countryService.deleteCountry(id);
    }
}