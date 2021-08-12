import React, { useEffect, useRef, useState } from 'react';
import './ExpandableSection.scss';
import { Button } from 'reactstrap';

export default function ExpandableSection({
  innerKey = null,
  headerComponent,
  disabledHeaderComponent,
  bodyComponent,
  isDeletable = false,
  onDelete = null,
  isExpandTriggered = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const prevIsExpandTriggeredRef = useRef<Boolean>();
  const prevIsOpenRef = useRef<Boolean>();
  useEffect(() => {
    prevIsExpandTriggeredRef.current = isExpandTriggered;
    prevIsOpenRef.current = isOpen;
  });
  const isExpandTriggeredChanged = isExpandTriggered !== prevIsExpandTriggeredRef.current;
  const isOpenChanged = isOpen !== prevIsOpenRef.current;
  if (!isOpenChanged && isExpandTriggeredChanged && isOpen !== isExpandTriggered) {
    setIsOpen(isExpandTriggered);
  }
  const isExpanded = isOpenChanged ? isOpen : isExpandTriggeredChanged ? isExpandTriggered : isOpen;
  return (
    <div className="expandable-section" key={innerKey}>
      <div className="expandable-section-header">
        <div className="inline-fields col-6 pl-0">{isExpanded ? headerComponent : disabledHeaderComponent}</div>
        <div className="icon-buttons col-6">
          {isDeletable && !!onDelete && (
            <Button className="icon-button" onClick={onDelete}>
              <i className="bi bi-trash" />
            </Button>
          )}
          <Button className="icon-button" onClick={() => setIsOpen(!isExpanded)}>
            <i className={`bi ${isExpanded ? 'bi-arrows-collapse' : 'bi-arrows-expand'}`} />
          </Button>
        </div>
      </div>
      {isExpanded && <div className="expandable-section-body">{bodyComponent}</div>}
    </div>
  );
}
