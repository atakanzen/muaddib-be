import { ArgumentMetadata, BadRequestException, Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';
import { validateDecisionTree } from './validators/decision-tree.validator';

interface ValidationOptions {
    required?: boolean;
}

@Injectable()
export class DecisionTreePipe implements PipeTransform {
    constructor(private options: ValidationOptions = {}) { }

    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'body') {
            return value;
        }

        const tree = value?.tree as string | undefined;

        if (tree === undefined) {
            if (this.options.required) {
                throw new BadRequestException('The "tree" field must have a value');
            }

            return value;
        }

        // Validate the tree
        const validation = validateDecisionTree(tree);

        if (validation.validatedTree === undefined) {
            throw new BadRequestException(validation.error);
        }

        value.tree = validation.validatedTree;
        
        return value;
    }
}
