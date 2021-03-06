'use strict';

var React = require('react');

var HiddenContent = React.createClass({
    render: function() {
        return (
            <div className="page-content">
                <div className="page-header">
                    <span className="title">HiddenContent</span>
                </div>

                <div className="page-body">
                    <div className="row">{/* start default */}
                        <div className="row">
                            <div className="col-md-12">
                                <span className="component-title">Hidden Content(내용 접기/펼치기)</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <Pum.HiddenContent expandLabel="펼치기" collapseLabel="접기"
                                                expandIcon="fa fa-caret-right" collapseIcon="fa fa-caret-down"
                                                isBottom={true}>
                                    <div>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                        내용<br/>
                                    </div>
                                </Pum.HiddenContent>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <Pum.HiddenContent expandLabel="소스 보기" collapseLabel="소스 닫기"
                                                expandIcon="fa fa-caret-right" collapseIcon="fa fa-caret-down">
                                    <Pum.TabSet>
                                        <Pum.Tabs>
                                            <Pum.Tab>JSX 코드</Pum.Tab>
                                        </Pum.Tabs>
                                        <Pum.TabContents>
                                            <Pum.TabContent>
                                                <pre className="prettyprint linenums">
                                                    {'// js\n' +
                                                    '안형로'}
                                                </pre>
                                            </Pum.TabContent>
                                        </Pum.TabContents>
                                    </Pum.TabSet>
                                </Pum.HiddenContent>
                            </div>
                        </div>
                    </div>{/* end default */}
                    <div className="vspace-12" />
                </div>

                <div className="page-footer">

                </div>

            </div>
        );
    }
});

module.exports = HiddenContent;