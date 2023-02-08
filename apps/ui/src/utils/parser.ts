// https://github.com/aptos-labs/aptos-core/blob/16781dcd0e8683c7408aed5f8e5de3c896ec152b/ecosystem/typescript/sdk/src/transaction_builder/transaction_vector.test.ts

import { HexString, TxnBuilderTypes } from 'aptos';

const {
  AccountAddress, Identifier, StructTag, TransactionArgumentAddress, TransactionArgumentBool, TransactionArgumentU128, TransactionArgumentU64, TransactionArgumentU8, TransactionArgumentU8Vector, TypeTagAddress,
  TypeTagBool, TypeTagSigner, TypeTagStruct, TypeTagU128, TypeTagU64, TypeTagU8, TypeTagVector
} = TxnBuilderTypes;

// parseTypeTagString('5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T')
export const parseTypeTagString = (type_tag_string: string): TxnBuilderTypes.TypeTag => {
  const [address, module, name] = type_tag_string.split('::');
  if (name) {
    const structTag = new StructTag(
      AccountAddress.fromHex(address),
      new Identifier(module),
      new Identifier(name),
      [],
    );

    return new TypeTagStruct(structTag);
  }

  switch (type_tag_string) {
    case 'bool':
      return new TypeTagBool();
    case 'u8':
      return new TypeTagU8();
    case 'u64':
      return new TypeTagU64();
    case 'u128':
      return new TypeTagU128();
    case 'address':
      return new TypeTagAddress();
    case 'signer':
      return new TypeTagSigner();
    default:
      throw new Error('Unknown type tag');
  }
};

export const parseTypeTag = (typeTag: any): TxnBuilderTypes.TypeTag => {
  if (typeTag.vector) {
    return new TypeTagVector(parseTypeTag(typeTag.vector));
  }

  if (typeTag.struct) {
    const {
      address,
      module,
      name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      type_args,
    }: {
      address: string;
      module: string;
      name: string;
      type_args: any[];
    } = typeTag.struct;

    const typeArgs = type_args.map((arg) => parseTypeTag(arg));
    const structTag = new StructTag(
      AccountAddress.fromHex(address),
      new Identifier(module),
      new Identifier(name),
      typeArgs,
    );

    return new TypeTagStruct(structTag);
  }

  switch (typeTag) {
    case 'bool':
      return new TypeTagBool();
    case 'u8':
      return new TypeTagU8();
    case 'u64':
      return new TypeTagU64();
    case 'u128':
      return new TypeTagU128();
    case 'address':
      return new TypeTagAddress();
    case 'signer':
      return new TypeTagSigner();
    default:
      throw new Error('Unknown type tag');
  }
};

// parseTransactionArgument({ U8: 8})
export const parseTransactionArgument = (arg: any): TxnBuilderTypes.TransactionArgument => {
  const argHasOwnProperty = (propertyName: string) => Object.prototype.hasOwnProperty.call(arg, propertyName);
  if (argHasOwnProperty('U8')) {
    // arg.U8 is a number
    return new TransactionArgumentU8(arg.U8);
  }

  if (argHasOwnProperty('U64')) {
    // arg.U64 is a string literal
    return new TransactionArgumentU64(BigInt(arg.U64));
  }

  if (argHasOwnProperty('U128')) {
    // arg.U128 is a string literal
    return new TransactionArgumentU128(BigInt(arg.U128));
  }

  if (argHasOwnProperty('Address')) {
    // arg.Address is a hex string
    return new TransactionArgumentAddress(AccountAddress.fromHex(arg.Address));
  }

  if (argHasOwnProperty('U8Vector')) {
    // arg.U8Vector is a hex string
    return new TransactionArgumentU8Vector(new HexString(arg.U8Vector).toUint8Array());
  }

  if (argHasOwnProperty('Bool')) {
    return new TransactionArgumentBool(arg.Bool);
  }

  throw new Error('Invalid Transaction Argument');
};
