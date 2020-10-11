/** @documenter yuidoc */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import Tagify from '@yaireo/tagify';

export default class EmberTagifyComponent extends Component {
    tagifyRef = null;

    @tracked value;

    @action
    onInsert(element) {
        this.setupTagify(element);
    }

    @action
    onWillDestroy() {
      this.tagifyRef.destroy();
    }

    setupTagify(element) {
        const { value, onChange } = this.args;

        // Require that users pass a date
        assert(
          '<EmberTagify> requires a `value` to be passed as the tagTextProp for tagify.',
          value !== undefined
        );
    
        // Require that users pass an onChange
        assert(
          '<EmberTagify> requires an `onChange` action or null for no action.',
          onChange !== undefined
        );
    
        // Pass all values and setup tagify
        run.scheduleOnce('afterRender', this, this._setTagifyOptions, element);    
    }

    _setTagifyOptions(element) {
        const fastboot = getOwner(this).lookup('service:fastboot');
        if (fastboot && fastboot.isFastBoot) {
          return;
        }

        const {
            onChange,
            ...rest
        } = this.args;
        
        this.tagifyRef = new Tagify(element, {
            onChange,
            ...rest
          });

    }
}
