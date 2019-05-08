let cocoon_element_counter = 0;

const create_new_id = function() {
  return (new Date().getTime() + cocoon_element_counter++);
};

const newcontent_braced = function(id) {
  return '[' + id + ']$1';
};

const newcontent_underscord = function(id) {
  return '_' + id + '_$1';
};

const getInsertionNodeElem = function(insertionNode, insertionTraversal, btn) {
  if(!insertionNode){
    return btn.parentNode;
  }

  if(typeof insertionNode === 'function') {
    if(insertionTraversal) {
      console.warn('association-insertion-traversal is ignored, because association-insertion-node is given as a function.');
    }
    return insertionNode(btn);
  }

  if(insertionTraversal) {
    // TODO:
    // https://github.com/nathanvda/cocoon/blob/master/app/assets/javascripts/cocoon.js#L32
    // data-association-insertion-traversal: the jquery traversal method to
    // allow node selection relative to the link. closest, next, children, etc.
    // return $this[insertionTraversal](insertionNode);
    return null;
  }
  else {
    return document.querySelector(insertionNode);
  }
};

const addFieldsHandler = (btn) => {
  const assoc = btn.getAttribute('data-association');
  const assocs = btn.getAttribute('data-associations');
  const content = btn.getAttribute('data-association-insertion-template');
  const insertionNode = btn.getAttribute('data-association-insertion-node');
  const insertionTraversal = btn.getAttribute('data-association-insertion-traversal');
  let insertionMethod = btn.getAttribute('data-association-insertion-method') || btn.getAttribute('data-association-insertion-position') || 'before';
  let new_id = create_new_id();
  let count = parseInt(btn.getAttribute('data-count'), 10);
  let regexp_braced = new RegExp('\\[new_' + assoc + '\\](.*?\\s)', 'g');
  let regexp_underscord = new RegExp('_new_' + assoc + '_(\\w*)', 'g');
  let new_content = content.replace(regexp_braced, newcontent_braced(new_id));
  let new_contents = [];

  if(new_content == content) {
    regexp_braced = new RegExp('\\[new_' + assocs + '\\](.*?\\s)', 'g');
    regexp_underscord = new RegExp('_new_' + assocs + '_(\\w*)', 'g');
    new_content = content.replace(regexp_braced, newcontent_braced(new_id));
  }

  new_content = new_content.replace(regexp_underscord, newcontent_underscord(new_id));
  new_contents = [new_content];

  count = (isNaN(count) ? 1 : Math.max(count, 1));
  count -= 1;

  while(count) {
    new_id = create_new_id();
    new_content = content.replace(regexp_braced, newcontent_braced(new_id));
    new_content = new_content.replace(regexp_underscord, newcontent_underscord(new_id));
    new_contents.push(new_content);
    count -= 1;
  }

  const insertionNodeElem = getInsertionNodeElem(insertionNode, insertionTraversal, btn);

  if(!insertionNodeElem || (insertionNodeElem.length == 0)) {
    console.warn("Couldn't find the element to insert the template. Make sure your `data-association-insertion-*` on `link_to_add_association` is correct.");
  }

  new_contents.forEach((node) => {
    const event = new CustomEvent('cocoon:before-insert', {detail: node});
    insertionNodeElem.dispatchEvent(event);

    if(!event.defaultPrevented) {
      switch(insertionMethod) {
        default:
        case 'before':
          insertionMethod = 'beforebegin';
        break;
        case 'after':
          insertionMethod = 'afterend';
        break;
        case 'append':
          insertionMethod = 'beforeend';
        break;
        case 'prepend':
          insertionMethod = 'afterbegin';
        break;
      }

      insertionNodeElem.insertAdjacentHTML(insertionMethod, node);
      insertionNodeElem.dispatchEvent(
        new CustomEvent('cocoon:after-insert', {detail: node})
      );
    }
  });
};

document.addEventListener('click', (e) => {
  if(e.target.matches('.add_fields')) {
    e.preventDefault();
    e.stopPropagation();
    addFieldsHandler(e.target);
  }
});

const removeFieldsHandler = (btn) => {
  const wrapperClass = btn.getAttribute('data-wrapper-class') || 'nested-fields';
  const nodeToDelete = btn.closest(`.${wrapperClass}`);
  const triggerNode = nodeToDelete.parentNode;

  const event = new CustomEvent('cocoon:before-remove', {detail: nodeToDelete});
  triggerNode.dispatchEvent(event);

  if(!event.defaultPrevented) {
    const timeout = triggerNode.getAttribute('data-remove-timeout') || 0;

    setTimeout(() => {
      if(btn.classList.contains('dynamic')) {
        // nodeToDelete.remove();
        nodeToDelete.parentNode.removeChild(nodeToDelete);
      }
      else {
        const input = btn.previousElementSibling;
        if(input && input.matches('input[type=hidden]')) {
          input.value = 1;
        }
        nodeToDelete.style.display = 'none';
      }

      triggerNode.dispatchEvent(
        new CustomEvent('cocoon:after-remove', {detail: nodeToDelete})
      );
    }, timeout);
  }
};

document.addEventListener('click', (e) => {
  if(
    e.target.matches('.remove_fields.dynamic') ||
    e.target.matches('.remove_fields.existing')
  ) {
    e.preventDefault();
    e.stopPropagation();
    removeFieldsHandler(e.target);
  }
});

const hideFields = () => {
  [...document.querySelectorAll('.remove_fields.existing.destroyed')].forEach((btn) => {
    const wrapperClass = btn.getAttribute('data-wrapper-class') || 'nested-fields';
    btn.closest(`.${wrapperClass}`).style.display = 'none';
  });
};

document.addEventListener('DOMContentLoaded', hideFields);
document.addEventListener('turbolinks:load', hideFields);
document.addEventListener('page:load', hideFields);
