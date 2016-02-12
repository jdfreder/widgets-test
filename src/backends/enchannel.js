export class EnchannelBackend {
  constructor(iopubStream) {
    this._iopubStream = iopubStream;
  }

  get iopubStream() {
    return this._iopubStream;
  }
}
