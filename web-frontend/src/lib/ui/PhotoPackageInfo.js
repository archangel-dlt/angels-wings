import uuid from 'uuid/v1';
import { PackageFields, Required } from "./PackageFields";

const description = 'description';
const supplier = 'supplier';
const creator = 'creator';
const rights = 'rights';

const photoFields = [
  { title: 'Title', field: Required.title },
  { title: 'Description', field: description },
  { title: '--'},
  { title: 'Supplier', field: supplier },
  { title: 'Creator', field: creator },
  { title: '--' },
  { title: 'Rights Statement', field: rights },
];

class SipInfo extends PackageFields {
  constructor(props) {
    super(props, photoFields);
    this[Required.key] = uuid();
    this[Required.pack] = 'photo';
  }
}

export default SipInfo;
