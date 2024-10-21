import { ArgumentMetadata, BadRequestException, Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';

@Injectable()
export class DecisionTreeValidationPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata) {
    // ! Should never trigger, placed just in case
    if (metadata.type !== 'body') {
        throw new InternalServerErrorException('"tree" field expected outside of a body');
    }

    const tree = body?.tree as string | undefined;

    if (tree === undefined) {
        throw new BadRequestException('The "tree" field must have a value');
    }

    // Validate the tree
    if (typeof tree !== 'string') {
        throw new BadRequestException('The "tree" field must be a string');
    }

    // TODO: JSONSchema validation


    // TODO: Switch tree for a TREE
    
    return body;
  }
}
