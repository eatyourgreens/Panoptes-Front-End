React = require 'react'
{Markdown} = require 'markdownz'
CroppedImage = require './cropped-image'

module.exports = React.createClass
  getDefaultProps: ->
    title: null
    content: null
    items: []
    icons: {}
    defaultSelection: [] # Path by indices of selected content, e.g. `[0, 1]`.
    breadcrumbs: false

  getInitialState: ->
    selection: @props.defaultSelection

  cutSelection: (index) ->
    @setState selection: @state.selection[...index]

  pushSelection: (index) ->
    @setState selection: [].concat @state.selection, index

  renderBreadcrumbs: (trail) ->
    <ul className="spotters-guide-breadcrumbs">
      {trail.map (item, i) =>
        jumpBack = @cutSelection.bind this, i + 1
        isCurrent = i is trail.length - 1
        <li key={i}>
          <button type="button" className="spotters-guide-breadcrumb" onClick={jumpBack} disabled={isCurrent}>
            {item.title}
          </button>
        </li>}
    </ul>

  renderItem: ({icon, title, content, items}) ->
    <div className="spotters-guide-item">
      <header>
        {if icon?
          <div className="spotters-guide-item-icon-container">
            <CroppedImage className="spotters-guide-item-icon" src={@props.icons[icon].src} aspectRatio={1} width="6em" height="6em" />
          </div>}
        {if title?
          <div className="spotters-guide-item-title-container">
            <Markdown content={title} inline />
          </div>}
      </header>
      {if content?
        <div className="spotters-guide-item-content-container">
          <Markdown content={content} />
        </div>}
      {if items?.length > 0
        <ul className="spotters-guide-menu">
          {items.map (item, i) =>
            goTo = @pushSelection.bind this, i
            <li key={i}>
              <button type="button" className="spotters-guide-menu-item" onClick={goTo}>
                <CroppedImage className="spotters-guide-menu-item-icon" src={@props.icons[item.icon]?.src} aspectRatio={1} width="4em" height="4em" />
                <span className="spotters-guide-menu-item-title">
                  {item.title}
                </span>
              </button>
            </li>}
        </ul>}
    </div>

  render: ->
    {icon, title, content, items} = @props
    implicitRootItem = {icon, title, content, items}

    if implicitRootItem.items?.length is 1
      implicitRootItem = implicitRootItem.items[0]

    selectionTrail = [[], @state.selection...].reduce (trail, index) =>
      items = (trail[trail.length - 1] ? implicitRootItem).items
      [].concat trail, items[index]

    selectedItem = selectionTrail[selectionTrail.length - 1] ? implicitRootItem

    levelUp = @cutSelection.bind this, selectionTrail.length - 1
    atRoot = @state.selection.length is 0

    <div className="spotters-guide">
      <header>
        <button type="button" className="spotters-guide-back-button" disabled={atRoot} onClick={levelUp}>◀</button>
        {if @props.breadcrumbs
          @renderBreadcrumbs selectionTrail}
      </header>

      {@renderItem selectedItem}
    </div>
