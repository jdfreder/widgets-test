import { Observable } from '@reactivex/rxjs';

const JUPYTER_WIDGET_COMM_TARGET = 'jupyter.widget';
const JUPYTER_WIDGET_VERSION_COMM_TARGET = 'jupyter.widget.version';

export class NotebookBackend {
  constructor(Jupyter) {
    this._iopubStream = Observable.create(observer => {
      this._iopubObserver = observer;
    });

    this._Jupyter = Jupyter;
    this._registerCommTarget(this._getConnectedKernel())
      .catch(err => console.error(`couldn't register comm targets`, err));
  }

  get iopubStream() {
    return this._iopubStream;
  }

  _handleMsg(msg) {
    this._iopubObserver.onNext(msg);
  }

  _handleWidget(comm, msg) {
    comm.on_msg(this._handleMsg.bind(this));
    comm.on_close(this._handleMsg.bind(this));
    this._handleMsg(msg);
  }

  _handleWidgetVersion(comm, msg) {
    comm.on_msg(this._handleMsg.bind(this));
    comm.on_close(this._handleMsg.bind(this));
    this._handleMsg(msg);
  }

  _registerCommTarget(kernel) {
    return Promise.resolve(kernel).then(kernel => {
      kernel.comm_manager.register_target(JUPYTER_WIDGET_COMM_TARGET, this._handleWidget.bind(this));
      kernel.comm_manager.register_target(JUPYTER_WIDGET_VERSION_COMM_TARGET, this._handleWidgetVersion.bind(this));

      // HACK: Prevent targets from being overwritten by ipywidgets.
      const original = kernel.comm_manager.register_target.bind(kernel.comm_manager);
      kernel.comm_manager.register_target = (targetName, f) => {
        if ([JUPYTER_WIDGET_COMM_TARGET, JUPYTER_WIDGET_VERSION_COMM_TARGET].indexOf(targetName)===-1) {
          return original(targetName, f);
        }
      };
    });
  }

  _getConnectedKernel() {
    return new Promise(resolve => {
      if (this._Jupyter.notebook.kernel && this._Jupyter.notebook.kernel.is_connected()) {
        resolve(this._Jupyter.notebook.kernel);
      } else {
        this._Jupyter.notebook.events.on('kernel_connected.Kernel', (event, data) => {
          resolve(data.kernel);
        });
      }
    });
  }
}
