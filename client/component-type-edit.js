/* global React */
import componentTypes from '../component-types.js'

function Classes (props) {
  const { component } = props
  const options = component.options || {}

  return (
    <div className='govuk-form-group'>
      <label className='govuk-label govuk-label--s' htmlFor='field-options.classes'>Classes</label>
      <span className='govuk-hint'>Additional CSS classes to add to the field<br />
      E.g. govuk-input--width-2 (or 3, 4, 5, 10, 20) or govuk-!-width-one-half (two-thirds, three-quarters etc.)</span>
      <input className='govuk-input' id='field-options.classes' name='options.classes' type='text'
        defaultValue={options.classes} />
    </div>
  )
}

function FieldEdit (props) {
  const { component } = props
  const options = component.options || {}

  return (
    <div>
      <div className='govuk-form-group'>
        <label className='govuk-label govuk-label--s' htmlFor='field-name'>Name</label>
        <span className='govuk-hint'>This is used as the key in the JSON output. Use `camelCasing` e.g. dateOfBirth or fullName.</span>
        <input className='govuk-input govuk-input--width-20' id='field-name'
          name='name' type='text' defaultValue={component.name} required pattern='^\S+' />
      </div>

      <div className='govuk-form-group'>
        <label className='govuk-label govuk-label--s' htmlFor='field-title'>Title</label>
        <span className='govuk-hint'>This is the title text displayed on the page</span>
        <input className='govuk-input' id='field-title' name='title' type='text'
          defaultValue={component.title} required />
      </div>

      <div className='govuk-form-group'>
        <label className='govuk-label govuk-label--s' htmlFor='field-hint'>Hint (optional)</label>
        <span className='govuk-hint'>The hint can include HTML</span>
        <textarea className='govuk-textarea' id='field-hint' name='hint'
          defaultValue={component.hint} rows='2' />
      </div>

      <div className='govuk-checkboxes govuk-form-group'>
        <div className='govuk-checkboxes__item'>
          <input className='govuk-checkboxes__input' id='field-options.required'
            name='options.required' type='checkbox' defaultChecked={options.required === false} />
          <label className='govuk-label govuk-checkboxes__label'
            htmlFor='field-options.required'>Optional</label>
        </div>
      </div>

      {props.children}
    </div>
  )
}

function TextFieldEdit (props) {
  const { component } = props
  const schema = component.schema || {}

  return (
    <FieldEdit component={component}>
      <details className='govuk-details'>
        <summary className='govuk-details__summary'>
          <span className='govuk-details__summary-text'>more</span>
        </summary>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-schema.max'>Max length</label>
          <span className='govuk-hint'>Specifies the maximum number of characters</span>
          <input className='govuk-input govuk-input--width-3' data-cast='number'
            id='field-schema.max' name='schema.max'
            defaultValue={schema.max} type='number' />
        </div>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-schema.min'>Min length</label>
          <span className='govuk-hint'>Specifies the minimum number of characters</span>
          <input className='govuk-input govuk-input--width-3' data-cast='number'
            id='field-schema.min' name='schema.min'
            defaultValue={schema.min} type='number' />
        </div>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-schema.length'>Length</label>
          <span className='govuk-hint'>Specifies the exact text length</span>
          <input className='govuk-input govuk-input--width-3' data-cast='number'
            id='field-schema.length' name='schema.length'
            defaultValue={schema.length} type='number' />
        </div>

        <Classes component={component} />
      </details>
    </FieldEdit>
  )
}

function MultilineTextFieldEdit (props) {
  const { component } = props
  const schema = component.schema || {}
  const options = component.options || {}

  return (
    <FieldEdit component={component}>
      <details className='govuk-details'>
        <summary className='govuk-details__summary'>
          <span className='govuk-details__summary-text'>more</span>
        </summary>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-schema.max'>Max length</label>
          <span className='govuk-hint'>Specifies the maximum number of characters</span>
          <input className='govuk-input govuk-input--width-3' data-cast='number'
            id='field-schema.max' name='schema.max'
            defaultValue={schema.max} type='number' />
        </div>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-schema.min'>Min length</label>
          <span className='govuk-hint'>Specifies the minimum number of characters</span>
          <input className='govuk-input govuk-input--width-3' data-cast='number'
            id='field-schema.min' name='schema.min'
            defaultValue={schema.min} type='number' />
        </div>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-options.rows'>Rows</label>
          <input className='govuk-input govuk-input--width-3' id='field-options.rows' name='options.rows' type='text'
            data-cast='number' defaultValue={options.rows} />
        </div>

        <Classes component={component} />
      </details>
    </FieldEdit>
  )
}

function NumberFieldEdit (props) {
  const { component } = props
  const schema = component.schema || {}

  return (
    <FieldEdit component={component}>
      <details className='govuk-details'>
        <summary className='govuk-details__summary'>
          <span className='govuk-details__summary-text'>more</span>
        </summary>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-schema.min'>Min</label>
          <span className='govuk-hint'>Specifies the minimum value</span>
          <input className='govuk-input govuk-input--width-3' data-cast='number'
            id='field-schema.min' name='schema.min'
            defaultValue={schema.min} type='number' />
        </div>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-schema.max'>Max</label>
          <span className='govuk-hint'>Specifies the maximum value</span>
          <input className='govuk-input govuk-input--width-3' data-cast='number'
            id='field-schema.max' name='schema.max'
            defaultValue={schema.max} type='number' />
        </div>

        <div className='govuk-checkboxes govuk-form-group'>
          <div className='govuk-checkboxes__item'>
            <input className='govuk-checkboxes__input' id='field-schema.integer' data-cast='boolean'
              name='schema.integer' type='checkbox' defaultChecked={schema.integer === true} />
            <label className='govuk-label govuk-checkboxes__label'
              htmlFor='field-schema.integer'>Integer</label>
          </div>
        </div>

        <Classes component={component} />
      </details>
    </FieldEdit>
  )
}

function SelectFieldEdit (props) {
  const { component, data } = props
  const options = component.options || {}
  const lists = data.lists

  return (
    <FieldEdit component={component}>
      <div>
        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-options.list'>List</label>
          <select className='govuk-select govuk-input--width-10' id='field-options.list' name='options.list'
            defaultValue={options.list} required>
            <option />
            {lists.map(list => {
              return <option key={list.name} value={list.name}>{list.title}</option>
            })}
          </select>
        </div>

        <Classes component={component} />
      </div>
    </FieldEdit>
  )
}

function RadiosFieldEdit (props) {
  const { component, data } = props
  const options = component.options || {}
  const lists = data.lists

  return (
    <FieldEdit component={component}>
      <div>
        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-options.list'>List</label>
          <select className='govuk-select govuk-input--width-10' id='field-options.list' name='options.list'
            defaultValue={options.list} required>
            <option />
            {lists.map(list => {
              return <option key={list.name} value={list.name}>{list.title}</option>
            })}
          </select>
        </div>
      </div>

      <div className='govuk-checkboxes govuk-form-group'>
        <div className='govuk-checkboxes__item'>
          <input className='govuk-checkboxes__input' id='field-options.bold' data-cast='boolean'
            name='options.bold' type='checkbox' defaultChecked={options.bold === true} />
          <label className='govuk-label govuk-checkboxes__label'
            htmlFor='field-options.bold'>Bold labels</label>
        </div>
      </div>
    </FieldEdit>
  )
}

function CheckboxesFieldEdit (props) {
  const { component, data } = props
  const options = component.options || {}
  const lists = data.lists

  return (
    <FieldEdit component={component}>
      <div>
        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='field-options.list'>List</label>
          <select className='govuk-select govuk-input--width-10' id='field-options.list' name='options.list'
            defaultValue={options.list} required>
            <option />
            {lists.map(list => {
              return <option key={list.name} value={list.name}>{list.title}</option>
            })}
          </select>
        </div>
      </div>

      <div className='govuk-checkboxes govuk-form-group'>
        <div className='govuk-checkboxes__item'>
          <input className='govuk-checkboxes__input' id='field-options.bold' data-cast='boolean'
            name='options.bold' type='checkbox' defaultChecked={options.bold === true} />
          <label className='govuk-label govuk-checkboxes__label'
            htmlFor='field-options.bold'>Bold labels</label>
        </div>
      </div>
    </FieldEdit>
  )
}

function ParaEdit (props) {
  const { component } = props

  return (
    <div className='govuk-form-group'>
      <label className='govuk-label' htmlFor='para-content'>Content</label>
      <span className='govuk-hint'>The content can include HTML and the `govuk-prose-scope` css class is available. Use this on a wrapping element to apply default govuk styles.</span>
      <textarea className='govuk-textarea' id='para-content' name='content'
        defaultValue={component.content} rows='10' required />
    </div>
  )
}

const InsetTextEdit = ParaEdit
const HtmlEdit = ParaEdit

function DetailsEdit (props) {
  const { component } = props

  return (
    <div>

      <div className='govuk-form-group'>
        <label className='govuk-label' htmlFor='details-title'>Title</label>
        <input className='govuk-input' id='details-title' name='title'
          defaultValue={component.title} required />
      </div>

      <div className='govuk-form-group'>
        <label className='govuk-label' htmlFor='details-content'>Content</label>
        <span className='govuk-hint'>The content can include HTML and the `govuk-prose-scope` css class is available. Use this on a wrapping element to apply default govuk styles.</span>
        <textarea className='govuk-textarea' id='details-content' name='content'
          defaultValue={component.content} rows='10' required />
      </div>
    </div>
  )
}

const componentTypeEditors = {
  'TextFieldEdit': TextFieldEdit,
  'EmailAddressFieldEdit': TextFieldEdit,
  'TelephoneNumberFieldEdit': TextFieldEdit,
  'NumberFieldEdit': NumberFieldEdit,
  'MultilineTextFieldEdit': MultilineTextFieldEdit,
  'SelectFieldEdit': SelectFieldEdit,
  'RadiosFieldEdit': RadiosFieldEdit,
  'CheckboxesFieldEdit': CheckboxesFieldEdit,
  'ParaEdit': ParaEdit,
  'HtmlEdit': HtmlEdit,
  'InsetTextEdit': InsetTextEdit,
  'DetailsEdit': DetailsEdit
}

class ComponentTypeEdit extends React.Component {
  render () {
    const { component, data } = this.props

    const type = componentTypes.find(t => t.name === component.type)
    if (!type) {
      return ''
    } else {
      const TagName = componentTypeEditors[`${component.type}Edit`] || FieldEdit
      return <TagName component={component} data={data} />
    }
  }
}

export default ComponentTypeEdit
