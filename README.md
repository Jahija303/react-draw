# A web app to make buisiness drawings

# Next steps

- Make a static layout, without content, just different background colors
  - symbol row with symbols and full screen function
  - tools drawer
  - sheet properties/display properties
  - drawing area with sheet
- full screen button should work
- add buttons to symbol line
  - they need to be grouped
  - they need to have a drop down option (last selected version should be displayed)
- tools drawer
  - make some dummy data structure groups=[{title: "", tools:[{img:"", title:""}]}]
  - add button to change state (wide/dense)
  - add group title and tool buttons
  - make the the groups selectable
- sheet options
  - page size, defaults
  - zoom in/out/defaults/user specified
- drawing area
  - draw the empty sheet
  - make it movable
  - make it react on zoom/page size

# Symbol row

- uses the full with
- has a full screen button at the right end, that is allways visible even when not all symbols fit the page width
- from the left:
  - import / export (open/save/... )
  - copy / paste
  - history incl. undo / redo
  - arrows and lines (each with drop down to select a style)
  - basic elements (image, text box)

# tools drawer

- group all tools into topics
- each group has a title and at least one tool
- the first topic should be open by default
- all other topics should have there titles; they should be stacked at the bottom
- clicking a title opens that topic
- the tools drawer has two states
  - default (wide) state (topics are visible, multiple tools per line)
  - dense state; topic titles are not visible; all tools are aligned vertically
  - there is a button at the top right of the drawer to switch between both states

# Sheet with options line

- at the bottom of the sheet section is an always visible sheet options line, where the properties of the sheets can be set and options for display may be changed
- sheet options:
  - sheet dimensions (drop down)
  - page selector (incl. option to sheet)
  - margins
  - page zoom (drop down incl. fit to screen/width/height)
  - grid (size, enable, snap to grid)
