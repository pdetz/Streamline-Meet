<script>
    import SelectButtons from '@shared/components/SelectButtons.svelte'; // Import the SelectButtons component
    import Tile from '@shared/components/Tile.svelte';
    import ColorPicker from '@meets/documents/tools/ColorPicker.svelte';
    import { COLORS, HEADERS } from '../meets/documents/tools/colorsEmojis';
    import EmojiPicker from '../meets/documents/tools/EmojiPicker.svelte';

    export let user;
    export let haveSettingsChanged;

    let theme = user?.theme || 'dark'; // Default to 'dark' if user is not defined
    let userTeamColor = user?.teamColor || '#aaa'; // Default team color if user is not defined
    let userDocumentColors = user?.documentColors || ['#fff', '#fff']; // Default document colors if user is not defined
    let userEmojis = user?.emojis || ['', '']; // Default emojis if user is not defined

    function applyTheme(newTheme) {
        theme = newTheme; // Update the theme variable
        if (user) { // Check if user is defined
            user.applyTheme(theme); // Apply the new theme to the user
        }
    }

    function selectTeamColor(colors) {
        userTeamColor = colors[0];
        user.updateTeamColor(colors[0]);
        haveSettingsChanged();
    }

    async function selectDocumentColors(colors) {
        console.log(colors);
        userDocumentColors = colors;
        user.updateDocumentColors(colors);
        haveSettingsChanged();
    }
    async function selectEmojis(emojis) {
        userEmojis = emojis; 
        user.set('emojis', emojis);
        haveSettingsChanged();
    }
</script>

<Tile size={{ width: '30em', height: 'auto' }}>
    <div slot="title">Colors</div>
    <div class="theme-settings">
        <!--<p>Select your preferred theme:</p>
        <SelectButtons
            options={['light', 'dark']}
            selected={theme}
            select={applyTheme}
            text={(option) => option[0].toUpperCase() + option.slice(1)}
        />-->
        <p>Select <span class='my_team'>{user.team.name}'s</span> team color:</p>
        <ColorPicker 
            selectColors={selectTeamColor}
            selectedColors={[userTeamColor]} 
            colors={[HEADERS]}
        />
        <p>Select your colors and emojis for meet documents:</p>
        <div class='doc-preview'>
            <table class='stripe'>
                <thead>
                    <tr>
                        <td class='name'> Age Group</td>
                        <td>IM</td>
                        <td>FR</td>
                        <td>BK</td>
                        <td>BR</td>
                        <td>FL</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class='name'> Entry Emoji </td>
                        <td>{userEmojis[0]}</td>
                        <td></td>
                        <td>{userEmojis[0]}</td>
                        <td></td>
                        <td>{userEmojis[0]}</td>
                    </tr>
                    <tr>
                        <td class='name'> Swim-Up Emoji </td>
                        <td></td>
                        <td>{userEmojis[1]}</td>
                        <td></td>
                        <td>{userEmojis[1]}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <ColorPicker 
                selectColors={selectDocumentColors}
                selectedColors={userDocumentColors} 
                colors={COLORS}
            />
            <EmojiPicker
                selectEmojis={selectEmojis}
                selectedEmojis={user.emojis}
                selectedColors={userDocumentColors}
            />
        </div>
    </div>
</Tile>

<style>
    div.doc-preview {
        margin: 1em 0;
        padding: 1em;
        border-radius: 0.5em;
        background-color: #fafafa;
        color: #000;
    }
    table.stripe td {
        width: 2em;
    }
    table.stripe td.name {
        width: 6em;
        text-align: left;
        padding-left: 0.25rem;
    }
</style>