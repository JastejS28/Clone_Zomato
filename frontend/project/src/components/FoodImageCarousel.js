import Carousel from 'react-bootstrap/Carousel';
import Styles from './FoodImageCarousel.module.css';
function DarkVariantExample({ name, address, imageUrl, contact }) {
    return (
        <Carousel data-bs-theme="dark">
            <Carousel.Item>
                <center>
                    <img
                        className={`d-block w-60 ${Styles['carousel-image']}`}
                        src={imageUrl}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                    <h5 className={Styles['restaurant-name']}>{name}</h5>
<p className={Styles['restaurant-detail']}>{address}</p>
<p className={Styles['restaurant-detail']}>{contact}</p>

                    </Carousel.Caption>
                </center>
            </Carousel.Item>
          
        </Carousel>
    );
}

export default DarkVariantExample;