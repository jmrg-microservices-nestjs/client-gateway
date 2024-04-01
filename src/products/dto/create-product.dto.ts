import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  public name: string;
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @Type(() => Number)
  public price: number;
  @IsString({
    always: true,
    message: 'Description is required',
  })

  @MaxLength(255)
  public description: string;

}
