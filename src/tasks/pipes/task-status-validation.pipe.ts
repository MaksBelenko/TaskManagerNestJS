import { PipeTransform, /*,ArgumentMetadata*/ 
BadRequestException} from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];
    transform(value: any) {
        //, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        if (!this.isValidStatus(value)) {
            throw new BadRequestException(`${value} is an invalid status`)
        }

        return value;
    }

    private isValidStatus(status:any) {
        const index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }
}
