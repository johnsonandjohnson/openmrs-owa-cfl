/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import './ExpandableSection.scss';
import { Button } from 'reactstrap';

export default function ExpandableSection({
  headerComponent,
  disabledHeaderComponent = headerComponent,
  bodyComponent,
  isRemovable = false,
  onRemove = null,
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
    <div className="expandable-section">
      <div className="expandable-section-header">
        <div className="inline-fields col-6 pl-0">{isExpanded ? headerComponent : disabledHeaderComponent}</div>
        <div className="icon-buttons col-6">
          {isRemovable && !!onRemove && (
            <Button className="icon-button" onClick={onRemove} data-testid="removeExpandableSectionButton">
              <i className="bi bi-trash" />
            </Button>
          )}
          <Button className="icon-button" onClick={() => setIsOpen(!isExpanded)} data-testid="expandableSectionButton">
            <i className={`bi ${isExpanded ? 'bi-arrows-collapse' : 'bi-arrows-expand'}`} />
          </Button>
        </div>
      </div>
      {isExpanded && <div className="expandable-section-body">{bodyComponent}</div>}
    </div>
  );
}
