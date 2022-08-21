import { Pagination } from "react-bootstrap"


const CustomPagination = ({ currentPage, paginate, totalPages }) => {
  const arrayOfpageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    arrayOfpageNumbers.push(i);
  }
  return (
    <Pagination  className="float-md-end d-flex justify-content-center pt-2" >
      <Pagination.First onClick={() => paginate(1)} />
      <Pagination.Prev disabled={totalPages === 1||currentPage === 1} onClick={() => paginate(currentPage - 1)} />

      {arrayOfpageNumbers.map((number) => (
        <Pagination.Item
          className={number === currentPage ? "active" : ""}
          onClick={() => paginate(number)}
          key={number}
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={totalPages === 1||currentPage === arrayOfpageNumbers.length} onClick={() => paginate(currentPage + 1)} />
      <Pagination.Last onClick={() => paginate(totalPages)} />
    </Pagination>
  );
};

export default CustomPagination;
