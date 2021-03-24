function Colors(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Accent color</Text>}>
        <ColorSelect
          settingsKey="accentColor"
          colors={[
/*            {color: 'red'},
            {color: 'firebrick'},
            {color: 'darkred'},
            {color: 'gold'},
            {color: '#F0A500'},
            {color: '#FF752D'},
            
            {color: 'plum'},
            {color: '#FF78B7'},
            {color: '#A51E7C'},
            {color: '#8080FF'},
            {color: '#4D86FF'},
            {color: 'deepskyblue'},

            {color: 'greenyellow'},
            {color: 'limegreen'},
            {color: '#72B314'},
            {color: 'azure'},
            {color: 'lemonchiffon'},
            {color: 'sienna'},*/

                        
            // Brown
            {color: '#583101'},
            {color: '#6f4518'},
            {color: '#8b5e34'},
            {color: '#bc8a5f'}, 
            {color: '#e7bc91'}, 
            {color: 'lemonchiffon'},
                        
            // Yellow
            {color: '#ff7b00'},
            {color: '#ff9500'},
            {color: '#ffaa00'},
            {color: '#ffc300'}, 
            {color: '#ffdd00'}, 
            {color: '#ffea00'},
                        
            // Red
            {color: '#6a040f'},
            {color: '#9d0208'},
            {color: '#b21e35'},
            {color: '#d00000'}, 
            {color: '#dc2f02'}, 
            {color: '#e85d04'},
                        
            // Pink
            {color: '#ff5d8f'},
            {color: '#ff97b7'},
            {color: '#ffacc5'},
            {color: '#ffcad4'}, 
            {color: '#f4acb7'}, 
            {color: '#ffd6ff'},

            // Purple
            {color: '#7209b7'}, 
            {color: '#5e548e'}, 
            {color: '#9f86c0'}, 
            {color: '#be95c4'}, 
            {color: '#e0b1cb'},
            {color: '#d4c1ec'},

            // Blue
            {color: '#072ac8'},
            {color: '#003554'}, 
            {color: '#006494'}, 
            {color: '#0582ca'},
            {color: '#00a6fb'},
            {color: '#cce6f4'},

            // Green
            {color: '#007f5f'},
            {color: '#2b9348'},
            {color: '#55a630'},
            {color: '#80b918'}, 
            {color: '#aacc00'}, 
            {color: 'greenyellow'},

            // Grey
            {color: '#333533'},
            {color: '#847577'},
            {color: '#a6a2a2'},
            {color: '#cfd2cd'},
            {color: '#e5e6e4'}, 
            {color: '#fbfbf2'}, 
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);