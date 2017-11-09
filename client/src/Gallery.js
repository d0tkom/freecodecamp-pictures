import React from 'react'
import Masonry from 'react-masonry-component';
import { Button, Icon, Image, Card } from 'semantic-ui-react';

const Gallery = (props) => (
    <Masonry>
    {props.pictures.map((item, i) => {
        return (
            <Card style={{margin: 10}}>
                <Image src={item.url} onError={() => {props.toDefault(i)}}/>
                <Card.Content>
                    <Card.Description>
                        Posted by: {item.userName}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button icon onClick={() => {props.getPictures(item.userId)}}>
                        <Icon name='user' />
                    </Button>
                    {props.active == 'my pictures' ?
                        <Button icon onClick={() => {props.delete(item._id)}}>
                            <Icon name='remove' />
                        </Button> :
                        ""
                    }
                </Card.Content>
          </Card>
        );
    })}
    </Masonry>
)

export default Gallery