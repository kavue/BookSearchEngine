import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries'; 
import { REMOVE_BOOK } from '../utils/mutations'; 
import type { Book } from '../models/Book';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Use the useQuery hook to fetch user data
  const { loading, data } = useQuery(GET_ME);
  
  // Default to empty savedBooks array if data is unavailable
  const userData = data?.me ?? { savedBooks: [] };

  // Use the useMutation hook for the REMOVE_BOOK mutation
  const [removeBookMutation] = useMutation(REMOVE_BOOK);

  // Handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      return false;
    }
  
    try {
      // Execute REMOVE_BOOK mutation
      await removeBookMutation({
        variables: { bookId },
        update(cache) {
          // Specify the type of data in the cache
          type MeQueryData = {
            me: {
              savedBooks: Book[];
            };
          };

          const existingData = cache.readQuery<MeQueryData>({ query: GET_ME }) || { me: { savedBooks: [] } };

          if (existingData?.me?.savedBooks) {
            const updatedBooks = existingData.me.savedBooks.filter(
              (book) => book.bookId !== bookId
            );

            cache.writeQuery({
              query: GET_ME,
              data: { me: { ...existingData.me, savedBooks: updatedBooks } },
            });
          }
        },
      });

      // Remove the book ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };  

  // If data is still loading, display a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: Book) => (
            <Col md='4' key={book.bookId}>
              <Card border='dark'>
                {book.image && (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
