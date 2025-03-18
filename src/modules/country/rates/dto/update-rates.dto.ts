import { PartialType } from "@nestjs/swagger";
import { CreateRatesDto } from "./create-rates.dto";

export class UpdateRatesDto extends PartialType(CreateRatesDto) { }