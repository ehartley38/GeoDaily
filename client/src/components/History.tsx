import { challengeSubmission } from "../customTypings/challengeSubmission";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { SubmissionPanel } from "./SubmissionPanel";
import "./history.css";
import ReactPaginate from "react-paginate";
import { Loading } from "./Loading";

type SubmissionsProps = {
  currentItems: challengeSubmission[] | null;
};

const Submissions = ({ currentItems }: SubmissionsProps) => {
  return (
    <div>
      {currentItems &&
        currentItems.map((submission) => (
          <SubmissionPanel key={submission.id} submission={submission} />
        ))}
    </div>
  );
};

export const History = () => {
  const axiosPrivate = useAxiosPrivate();
  const [submissionHistory, setSubmissionHistory] = useState<
    challengeSubmission[] | null
  >(null);
  const [currentItems, setCurrentItems] = useState<
    challengeSubmission[] | null
  >(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const submissionHistory = await axiosPrivate.get(
          "/challenges/history",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (submissionHistory.data.length > 0) {
          setSubmissionHistory(submissionHistory.data);
        } else {
          setSubmissionHistory(null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissionHistory();
  }, []);

  useEffect(() => {
    if (submissionHistory) {
      const endOffSet = itemOffset + itemsPerPage;
      setCurrentItems(submissionHistory?.slice(itemOffset, endOffSet));
      setPageCount(Math.ceil(submissionHistory?.length / itemsPerPage));
    }
  }, [itemOffset, itemsPerPage, submissionHistory]);

  const handlePageClick = (e: { selected: number }) => {
    if (submissionHistory) {
      const newOffset = (e.selected * itemsPerPage) % submissionHistory.length;
      setItemOffset(newOffset);
    }
  };

  if (isLoading)
    return (
      <div className="history-page">
        <h1>History</h1>
        <Loading isFullPage={false} />
      </div>
    );

  return (
    <div className="history-page">
      <h1>History</h1>
      {!submissionHistory && (
        <>
          <p>Nothing here :(</p>
          <p>Why not try the daily challenge?</p>
        </>
      )}
      {submissionHistory && (
        <>
          <div className="history-page-content">
            <Submissions currentItems={currentItems} />
          </div>
          <div>
            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="< previous"
              breakLabel="..."
              containerClassName="pagination"
              activeClassName="active"
              pageClassName="page"
              previousClassName="previous"
              nextClassName="next"
              breakClassName="break"
              renderOnZeroPageCount={null}
            />
          </div>
        </>
      )}
    </div>
  );
};
