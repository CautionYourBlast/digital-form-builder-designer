/* global React ReactDOM dagre */

import Page from './page'
import Flyout from './flyout'
import DataModel from './data-model'
import PageCreate from './page-create'
import LinkEdit from './link-edit'
import LinkCreate from './link-create'
import ListsEdit from './lists-edit'
import SectionsEdit from './sections-edit'

function getLayout (pages, el) {
  // Create a new directed graph
  var g = new dagre.graphlib.Graph()

  // Set an object for the graph label
  g.setGraph({
    rankdir: 'LR',
    marginx: 50,
    marginy: 150,
    ranksep: 160
  })

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function () { return {} })

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each node
  pages.forEach((page, index) => {
    const pageEl = el.children[index]

    g.setNode(page.path, { label: page.path, width: pageEl.offsetWidth, height: pageEl.offsetHeight })
  })

  // Add edges to the graph.
  pages.forEach(page => {
    if (Array.isArray(page.next)) {
      page.next.forEach(next => {
        // The linked node (next page) may not exist if it's filtered
        const exists = pages.find(page => page.path === next.path)
        if (exists) {
          g.setEdge(page.path, next.path)
        }
      })
    }
  })

  dagre.layout(g)

  const pos = {
    nodes: [],
    edges: []
  }

  const output = g.graph()
  pos.width = output.width + 'px'
  pos.height = output.height + 'px'
  g.nodes().forEach((v, index) => {
    const node = g.node(v)
    const pt = { node }
    pt.top = (node.y - node.height / 2) + 'px'
    pt.left = (node.x - node.width / 2) + 'px'
    pos.nodes.push(pt)
  })

  g.edges().forEach((e, index) => {
    const edge = g.edge(e)
    pos.edges.push({
      source: e.v,
      target: e.w,
      points: edge.points.map(p => {
        const pt = {}
        pt.y = p.y
        pt.x = p.x
        return pt
      })
    })
  })

  return { g, pos }
}

class Lines extends React.Component {
  state = {}

  editLink = (edge) => {
    console.log('clicked', edge)
    this.setState({
      showEditor: edge
    })
  }

  render () {
    const { layout, data } = this.props

    return (
      <div>
        <svg height={layout.height} width={layout.width}>
          {
            layout.edges.map(edge => {
              const points = edge.points.map(points => `${points.x},${points.y}`).join(' ')
              return (
                <g key={points}>
                  <polyline
                    onClick={() => this.editLink(edge)}
                    points={points} />
                </g>
              )
            })
          }
        </svg>

        <Flyout title='Edit Link' show={this.state.showEditor}
          onHide={e => this.setState({ showEditor: false })}>
          <LinkEdit edge={this.state.showEditor} data={data}
            onEdit={e => this.setState({ showEditor: false })} />
        </Flyout>
      </div>
    )
  }
}

class Minimap extends React.Component {
  state = {}

  onClickPage = (e, path) => {
    return this.props.toggleFilterPath(path)
  }

  render () {
    const { layout, scale = 0.05 } = this.props

    return (
      <div className='minimap'>
        <svg height={parseFloat(layout.height) * scale} width={parseFloat(layout.width) * scale}>
          {
            layout.edges.map(edge => {
              const points = edge.points.map(points => `${points.x * scale},${points.y * scale}`).join(' ')
              return (
                <g key={points}>
                  <polyline points={points} />
                </g>
              )
            })
          }
          {
            layout.nodes.map((node, index) => {
              return (
                <g key={node + index}>
                  <a xlinkHref={`#${node.node.label}`}>
                    <rect x={parseFloat(node.left) * scale}
                      y={parseFloat(node.top) * scale}
                      width={node.node.width * scale}
                      height={node.node.height * scale}
                      title={node.node.label} />
                  </a>
                </g>
              )
            })
          }
        </svg>
      </div>
    )
  }
}

class Visualisation extends React.Component {
  state = {
    filterPaths: []
  }

  constructor () {
    super()
    this.ref = React.createRef()
  }

  scheduleLayout () {
    setTimeout(() => {
      const pages = this.getFilteredPages()
      const layout = getLayout(pages, this.ref.current)

      this.setState({
        layout: layout.pos
      })
    }, 200)
  }

  componentDidMount () {
    this.scheduleLayout()
  }

  getFilteredPages () {
    const includeUpstream = true
    const includeDownstream = true
    const { data } = this.props
    const { filterPaths } = this.state
    const { pages } = data

    if (!filterPaths.length) {
      return pages
    }

    const filteredPages = filterPaths.map(path => pages.find(page => page.path === path))

    // Upstream paths
    const upstreamPaths = {}

    if (includeUpstream) {
      filteredPages.forEach(page => {
        if (Array.isArray(page.next)) {
          page.next.forEach(next => {
            upstreamPaths[next.path] = true
          })
        }
      })
    }

    // Downstream paths
    const downstreamPaths = {}

    if (includeDownstream) {
      pages.forEach(page => {
        if (Array.isArray(page.next)) {
          page.next.forEach(next => {
            if (filterPaths.includes(next.path)) {
              downstreamPaths[page.path] = true
            }
          })
        }
      })
    }

    const filter = (page) => {
      return filterPaths.includes(page.path) ||
        upstreamPaths[page.path] ||
        downstreamPaths[page.path]
    }

    return data.pages.filter(filter)
  }

  componentWillReceiveProps () {
    this.scheduleLayout()
  }

  toggleFilterPath = (path) => {
    const { filterPaths } = this.state
    const idx = filterPaths.indexOf(path)

    if (idx > -1) {
      this.setState({
        filterPaths: filterPaths.filter((item, index) => index === idx)
      })
    } else {
      this.setState({
        filterPaths: filterPaths.concat(path)
      })
    }

    this.scheduleLayout()
  }

  render () {
    const { data } = this.props
    const { filterPaths } = this.state
    const pages = this.getFilteredPages()

    return (
      <div ref={this.ref} className='visualisation' style={this.state.layout &&
        { width: this.state.layout.width, height: this.state.layout.height }}>
        {pages.map((page, index) => <Page
          key={index} data={data} page={page} filtered={!filterPaths.includes(page.path)}
          layout={this.state.layout && this.state.layout.nodes[index]} />
        )}
        {this.state.layout &&
          <Lines layout={this.state.layout} data={data} />}

        {this.state.layout &&
          <Minimap layout={this.state.layout} data={data} />}
      </div>
    )
  }
}

class Menu extends React.Component {
  state = {}

  onClickUpload = (e) => {
    e.preventDefault()
    document.getElementById('upload').click()
  }

  onFileUpload = (e) => {
    const { data } = this.props
    const file = e.target.files.item(0)
    const reader = new window.FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt) {
      const content = JSON.parse(evt.target.result)
      data.save(content)
    }
  }

  render () {
    const { data, playgroundMode } = this.props

    return (
      <div className='menu'>
        <button className={`govuk-button govuk-!-font-size-14${this.state.showMenu ? ' govuk-!-margin-right-2' : ''}`}
          onClick={() => this.setState({ showMenu: !this.state.showMenu })}>☰</button>
        {this.state.showMenu && <span className='menu-inner'>
          <button className='govuk-button govuk-!-font-size-14'
            onClick={() => this.setState({ showAddPage: true })}>Add Page</button>{' '}

          <button className='govuk-button govuk-!-font-size-14'
            onClick={() => this.setState({ showAddLink: true })}>Add Link</button>{' '}

          <button className='govuk-button govuk-!-font-size-14'
            onClick={() => this.setState({ showEditSections: true })}>Edit Sections</button>{' '}

          <button className='govuk-button govuk-!-font-size-14'
            onClick={() => this.setState({ showEditLists: true })}>Edit Lists</button>{' '}

          <button className='govuk-button govuk-!-font-size-14'
            onClick={() => this.setState({ showDataModel: true })}>View Data Model</button>{' '}

          <button className='govuk-button govuk-!-font-size-14'
            onClick={() => this.setState({ showJSONData: true })}>View JSON</button>{' '}

          <button className='govuk-button govuk-!-font-size-14'
            onClick={() => this.setState({ showSummary: true })}>Summary</button>

          {playgroundMode && (
            <div className='govuk-!-margin-top-4'>
              <a className='govuk-link govuk-link--no-visited-state govuk-!-font-size-16' download href='/api/data?format=true'>Download JSON</a>{' '}
              <a className='govuk-link govuk-link--no-visited-state govuk-!-font-size-16' href='#' onClick={this.onClickUpload}>Upload JSON</a>{' '}
              <input type='file' id='upload' hidden onChange={this.onFileUpload} />
            </div>
          )}

          <Flyout title='Add Page' show={this.state.showAddPage}
            onHide={() => this.setState({ showAddPage: false })}>
            <PageCreate data={data} onCreate={() => this.setState({ showAddPage: false })} />
          </Flyout>

          <Flyout title='Add Link' show={this.state.showAddLink}
            onHide={() => this.setState({ showAddLink: false })}>
            <LinkCreate data={data} onCreate={() => this.setState({ showAddLink: false })} />
          </Flyout>

          <Flyout title='Edit Sections' show={this.state.showEditSections}
            onHide={() => this.setState({ showEditSections: false })}>
            <SectionsEdit data={data} onCreate={() => this.setState({ showEditSections: false })} />
          </Flyout>

          <Flyout title='Edit Lists' show={this.state.showEditLists}
            onHide={() => this.setState({ showEditLists: false })} width='xlarge'>
            <ListsEdit data={data} onCreate={() => this.setState({ showEditLists: false })} />
          </Flyout>

          <Flyout title='Data Model' show={this.state.showDataModel}
            onHide={() => this.setState({ showDataModel: false })}>
            <DataModel data={data} />
          </Flyout>

          <Flyout title='JSON Data' show={this.state.showJSONData}
            onHide={() => this.setState({ showJSONData: false })} width='large'>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Flyout>

          <Flyout title='Summary' show={this.state.showSummary}
            onHide={() => this.setState({ showSummary: false })}>
            <pre>{JSON.stringify(data.pages.map(page => page.path), null, 2)}</pre>
          </Flyout>
        </span>
        }
      </div>
    )
  }
}

class App extends React.Component {
  state = {}

  componentWillMount () {
    window.fetch('/api/data').then(res => res.json()).then(data => {
      data.save = this.save
      this.setState({ loaded: true, data })
    })
  }

  save = (updatedData) => {
    return window.fetch(`/api/data`, {
      method: 'put',
      body: JSON.stringify(updatedData)
    }).then(res => {
      if (!res.ok) {
        throw Error(res.statusText)
      }
      return res
    }).then(res => res.json()).then(data => {
      data.save = this.save
      this.setState({ data })

      // Reload frame if split screen and in playground mode
      if (window.DFBD.playgroundMode) {
        const parent = window.parent
        if (parent.location.pathname === '/split') {
          const frames = window.parent.frames

          if (frames.length === 2) {
            const preview = window.parent.frames[1]
            preview.location.reload()
          }
        }
      }

      return data
    }).catch(err => {
      console.error(err)
      window.alert('Save failed')
    })
  }

  render () {
    if (this.state.loaded) {
      return (
        <div id='app'>
          <Menu data={this.state.data} playgroundMode={window.DFBD.playgroundMode} />
          <Visualisation data={this.state.data} />
        </div>
      )
    } else {
      return <div>Loading...</div>
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
