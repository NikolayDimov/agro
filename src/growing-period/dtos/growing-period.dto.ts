import { Expose, Type } from "class-transformer";
import { IsUUID } from "class-validator";
import { FieldDto } from "../../field/dtos/field-dto";
import { CropDto } from "../../crop/dtos/crop.dto";

export class GrowingPeriodDto {
  @Expose()
  id: string;

  @Expose()
  date: Date;

  @Expose()
  @IsUUID()
  @Type(() => FieldDto)
  field: FieldDto;

  @Expose()
  @IsUUID()
  @Type(() => CropDto)
  crop: CropDto;
}
