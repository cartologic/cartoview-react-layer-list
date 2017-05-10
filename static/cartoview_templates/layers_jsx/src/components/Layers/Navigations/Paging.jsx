import React from 'react';
import { Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';


export default class Paging extends React.Component{
  render () {
    return (
      <Col xs="12">
        <Pagination id="layersPagination">

          <PaginationItem>
            <PaginationLink previous href={void(0)} onClick={()=>{this.props.handlePreviousClick()}}/>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href={void(0)}>
              Page {this.props.currentPage} of {this.props.pagesCount}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink next href={void(0)} onClick={()=>{this.props.handleNextClick()}}/>
          </PaginationItem>
        </Pagination>
      </Col>
    );
  }
}
